var pageDB = (function() {
   var tDB = {};
   var datastore = null;
   var taskstore = null;


   // TABS 

   /**
	 * Open a connection to the datastore.
	 */
	tDB.open = function(callback) {
	  // Database version.
	  var version = 1;

	  // Open a connection to the datastore.
	  var request = indexedDB.open('tabs', version);

	  // Handle datastore upgrades.
	  request.onupgradeneeded = function(e) {
	    var db = e.target.result;
	    e.target.transaction.onerror = tDB.onerror;
	    // Delete the old datastore.
	    if (db.objectStoreNames.contains('tab')) {
	      db.deleteObjectStore('tab');
	    }
	    // Create a new datastore.
	    var store = db.createObjectStore('tab', {
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
	tDB.fetchTabs = function(callback) {
	  var db = datastore;
	  var transaction = db.transaction(['tab'], 'readwrite');
	  var objStore = transaction.objectStore('tab');

	  var keyRange = IDBKeyRange.lowerBound(0);
	  var cursorRequest = objStore.openCursor(keyRange);

	  var tabs = [];

	  transaction.oncomplete = function(e) {
	    // Execute the callback function.
	    callback(tabs);
	  };

	  cursorRequest.onsuccess = function(e) {
	    var result = e.target.result;

	    if (!!result == false) {
	      return;
	    }

	    tabs.push(result.value);

	    result.continue();
	  };

	  cursorRequest.onerror = tDB.onerror;
	};

	// Create a new item
	tDB.createTab = function(task, title, importance, highlighted, url, callback) {
	  // Get a reference to the db.
	  var db = datastore;

	  // Initiate a new transaction.
	  var transaction = db.transaction(['tab'], 'readwrite');

	  // Get the datastore.
	  var objStore = transaction.objectStore('tab');

	  // Create a timestamp for the tab item.
	  var timestamp = new Date().getTime();

	  // Create an object for the tab item.
	  var tab = {
	  	 'task': task,
	    'title': title,
	    'importance': importance,
	    'highlighted': highlighted,
	    'url':url,
	    'timestamp': timestamp
	  };

	  // Create the datastore request.
	  var request = objStore.put(tab);

	  // Handle a successful datastore put.
	  request.onsuccess = function(e) {
	    // Execute the callback function.
	    callback(tab);
	  };

	  // Handle errors.
	  request.onerror = tDB.onerror;
	};

	/**
	 * Delete a tab item.
	 */
	tDB.deleteTab = function(id, callback) {
	  var db = datastore;
	  var transaction = db.transaction(['tab'], 'readwrite');
	  var objStore = transaction.objectStore('tab');

	  var request = objStore.delete(id);

	  request.onsuccess = function(e) {
	    callback();
	  }

	  request.onerror = function(e) {
	    console.log(e);
	  }
	};



	// TASKS

	/**
	 * Fetch all of the tasks in the taskstore.
	 */
	tDB.fetchTasks = function(callback) {
	  var db = taskstore;
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


	// Create a new task
	tDB.createTask = function(task, callback) {
	  // Get a reference to the db.
	  var db = taskstore;

	  // Initiate a new transaction.
	  var transaction = db.transaction(['task'], 'readwrite');
	 
	  //we never get to here!
	  alert();

	  // Get the datastore.
	  var objStore = transaction.objectStore('task');

	  // Create a timestamp for the tab item.
	  var timestamp = new Date().getTime();

	  // Create an object for the tab item.
	  var tsk = {
	  	 'task': task,
	    'timestamp': timestamp
	  };

	  // Create the datastore request.
	  var request = objStore.put(tsk);
	  // Handle a successful datastore put.
	  request.onsuccess = function(e) {
	    // Execute the callback function.
	    callback(tsk);
	  };

	  // Handle errors.
	  request.onerror = tDB.onerror;
	};

	/**
	 * Delete a task item.
	 */
	tDB.deleteTask = function(id, callback) {
	  var db = taskstore;
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

  // Export the tDB object.
  return tDB;
}());
