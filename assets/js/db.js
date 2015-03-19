pageDB = (function() {
   var tDB = {};
   var datastore = null;

   /**
	 * Open a connection to the datastore.
	 */
	tDB.open = function(callback) {
	  // Database version.
	  var version = 1;

	  // Open a connection to the datastore.
	  var request = window.indexedDB.open('tabs', version);

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

	/**
	 * Swap tab ids to change order of db
	 */
	tDB.swapId = function(id1, id2, callback) {
		var db = datastore;
		var transaction = db.transaction(['tab'], 'readwrite');
		var objStore = transaction.objectStore('tab');
		var request = objStore.get(id1);
		var request2 = objStore.get(id2);

		request.onsuccess = function(e) {
			//get the old value we want to update
			var tab = request.result;
			console.log("id1:" + tab.timestamp);
			tab.timestamp = id2;
			console.log("id2:" + tab.timestamp);

			//put this updated object back into the DB!
			var requestUpdate = objStore.put(tab);
		
			// Handle a successful datastore put.
		   requestUpdate.onsuccess = function(e) {
		    	callback();
	 		 };

			// Handle errors.
			requestUpdate.onerror = tDB.onerror;
		}

		request2.onsuccess = function(e) {
			//get the old value we want to update
			var tab = request2.result;
			tab.timestamp = id1;
			var requestUpdate = objStore.put(tab);
		   requestUpdate.onsuccess = function(e) {
		    	callback();
	 		 };
			requestUpdate.onerror = tDB.onerror;
		}
	}

	/**
	 * Change a tab's task.
	 */
	tDB.changeTask = function(id, newTask, callback) {
		var db = datastore;
		var transaction = db.transaction(['tab'], 'readwrite');
		var objStore = transaction.objectStore('tab');
		var request = objStore.get(id);

		request.onsuccess = function(e) {
			//get the old value we want to update
			var tab = request.result;
			tab.task = newTask;

			//put this updated object back into the DB!
			var requestUpdate = objStore.put(tab);
		
			// Handle a successful datastore put.
		   requestUpdate.onsuccess = function(e) {
		    	callback();
	 		 };

			// Handle errors.
			requestUpdate.onerror = tDB.onerror;
		}
	}

	/**
	 * Change a tab's importance.
	 */
	tDB.changeImportance = function(id, importance, callback) {
		var db = datastore;
		var transaction = db.transaction(['tab'], 'readwrite');
		var objStore = transaction.objectStore('tab');
		var request = objStore.get(id);

		request.onsuccess = function(e) {
			//get the old value we want to update
			var tab = request.result;
			tab.importance = importance;

			//put this updated object back into the DB!
			var requestUpdate = objStore.put(tab);
		
			// Handle a successful datastore put.
		   requestUpdate.onsuccess = function(e) {
		    	callback();
	 		 };

			// Handle errors.
			requestUpdate.onerror = tDB.onerror;
		}
	}

	/**
	 * Change a tab's title.
	 */
	tDB.changeTitle = function(id, title, callback) {
		var db = datastore;
		var transaction = db.transaction(['tab'], 'readwrite');
		var objStore = transaction.objectStore('tab');
		var request = objStore.get(id);

		request.onsuccess = function(e) {
			//get the old value we want to update
			var tab = request.result;
			tab.title = title;

			//put this updated object back into the DB!
			var requestUpdate = objStore.put(tab);
		
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

