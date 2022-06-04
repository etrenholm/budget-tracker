// variable to hold db connection
let db;

// establish connnection to IndexedDB database
const request = indexedDB.open('budget-tracker', 1);

// if database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('new_transaction', { autoIncrement: true })
}

// if successful
request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        uploadRecord()
    }
}

// if error
request.onerror = function(event) {
    console.log(event.target.errorCode);
}

// if no internet connection
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite')
    const dataObjectStore = transaction.objectStore('new_transaction')
    dataObjectStore.add(record)
}

// when internet connection is reestablished
function uploadRecord() {
    const transaction = db.transaction(['new_transaction'], 'readwrite')
    const dataObjectStore = transaction.objectStore('new_transaction')
    const getAll = dataObjectStore.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch(`/api/transaction`, {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                const transaction = db.transaction(['new_transaction'], 'readwrite')
                const dataObjectStore = transaction.objectStore('new_transaction')
                dataObjectStore.clear()

                alert('All saved transactions have been submitted.')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

window.addEventListener('online', uploadRecord)