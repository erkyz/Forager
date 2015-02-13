// task database.

var taskDB = (function() {
   var tDB = {};
   var datastore = null;

   /**
	 * Open a connection to the datastore.
	 */
	tDB.open = function(callback) {
	  // Database version.
	  var version = 1;

	  // Open a connection to the datastore.
	  var request = indexedDB.open('tasks', version);

	  // Handle datastore upgrades.
	  request.onupgradeneeded = function(e) {
	    var db = e.target.result;
	    e.target.transaction.onerror = tDB.onerror;
	    // Delete the old datastore.
	    if (db.objectStoreNames.contains('task')) {
	      db.deleteObjectStore('task');
	    }
	    // Create a new datastore.
	    var store = db.createObjectStore('task', {
	      keyPath: 'timestamp'
	    });
	  };

	  // Handle successful datastore access.
	  request.onsuccess = function(e) {
	    // Get a reference to the DB.
	    datastore = e.target.result;
	    // Execute the callback.
	    callback();
	  };

	  // Handle errors when opening the datastore.
	  request.onerror = tDB.onerror;
	};

	/**
	 * Fetch all of the todo items in the datastore.
	 */
	tDB.fetchTasks = function(callback) {
	  var db = datastore;
	  var transaction = db.transaction(['task'], 'readwrite');
	  var objStore = transaction.objectStore('task');

	  var keyRange = IDBKeyRange.lowerBound(0);
	  var cursorRequest = objStore.openCursor(keyRange);

	  var tasks = [];

	  transaction.oncomplete = function(e) {
	    // Execute the callback function.
	    callback(tasks);
	  };

	  cursorRequest.onsuccess = function(e) {
	    var result = e.target.result;

	    if (!!result == false) {
	      return;
	    }

	    tasks.push(result.value);

	    result.continue();
	  };

	  cursorRequest.onerror = tDB.onerror;
	};


	// Create a new item
	tDB.createTask = function(task, callback) {
	  // Get a reference to the db.
	  var db = datastore;

	  // Initiate a new transaction.
	  var transaction = db.transaction(['task'], 'readwrite');

	  // Get the datastore.
	  var objStore = transaction.objectStore('task');

	  // Create a timestamp for the task
	  var timestamp = new Date().getTime();

	  // Create an object for the task
	  var task = {
	  	 'task': task,
	  	 'count': 1,
	    'timestamp': timestamp
	  };

	  // Create the datastore request.
	  var request = objStore.put(task);

	  // Handle a successful datastore put.
	  request.onsuccess = function(e) {
	    // Execute the callback function.
	    callback(task);
	  };

	  // Handle errors.
	  request.onerror = tDB.onerror;
	};

	/**
	 * Delete a task
	 */
	tDB.deleteTask = function(id, callback) {
	  var db = datastore;
	  var transaction = db.transaction(['task'], 'readwrite');
	  var objStore = transaction.objectStore('task');
	  var request = objStore.delete(id);

	  request.onsuccess = function(e) {
	    callback();
	  }

	  request.onerror = function(e) {
	    console.log(e);
	  }
	};


	/**
	 * Increment a task's counter if it's used.
	 */
	tDB.incrementCount = function(id, callback) {
		var db = datastore;
		var transaction = db.transaction(['task'], 'readwrite');
		var objStore = transaction.objectStore('task');
		var request = objStore.get(id);

		request.onsuccess = function(e) {
			//get the old value we want to update
			var task = request.result;

			//increment.
			task.count += 1;

			//put this updated object back into the DB!
			var requestUpdate = objStore.put(task);
			
			// Handle a successful datastore put.
		   requestUpdate.onsuccess = function(e) {
		    	callback();
	 		 };

			// Handle errors.
			requestUpdate.onerror = tDB.onerror;
		}
	}

  // Export the tDB object.
  return tDB;
}());