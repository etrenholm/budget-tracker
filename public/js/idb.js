// variable to hold db connection
let db;

// establish connnection to IndexedDB database
const request = indexedDB.open('budget_tracker', 1);

// if database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('new_transaction', { autoIncrement: true })
};

// if successful
request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        // upload data
    }
};

// if error
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// if no internet connection
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite')
    const dataObjectStore = transaction.objectStore('new_transaction')
    dataObjectStore.add(record)
}