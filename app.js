if ('serviceWorker' in navigator && 'SyncManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });

    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('api-data').innerHTML = JSON.stringify(data);
        });

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            message: formData.get('message')
        };

        saveFormData(data);

        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('sync-form');
        });
    });
}

function saveFormData(data) {
    const dbRequest = indexedDB.open('form-data', 1);

    dbRequest.onupgradeneeded = event => {
        const db = event.target.result;
        db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
    };

    dbRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction('posts', 'readwrite');
        const store = transaction.objectStore('posts');
        store.add(data);
    };

    dbRequest.onerror = event => {
        console.error('Error opening IndexedDB:', event.target.errorCode);
    };
}
