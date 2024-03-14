class DataSourceEndpoint {
    constructor() {
        this.dataItems = [];
        this.position = 0;
        this.cacheItems = [];
        this.dbName = 'ImageDataDB';
        this.dbVersion = 1;
        this.storeName = 'images';
        this.db = null;
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject('Failed to open the database');
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { autoIncrement: true });
                }
            };
        });
    }

    async saveToIndexedDB(items) {
        await this.openDatabase();
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        items.forEach((item) => {
            store.add(item);
        });
    }

    async retrieveFromIndexedDB() {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject('Error retrieving data from IndexedDB');
            };
        });
    }

    async generateDataItem() {
        const randomNum = Math.floor(Math.random() * 1000);
        const url = `https://picsum.photos/600/450?random=${randomNum}`;
        const creationDate = new Date().toISOString();
        const dataItem = { url, creationDate };
        return dataItem;
    }

    async getNextDataItems(numberOfItemsToGet) {
        let result = [];
    
        for (let i = 0; i < numberOfItemsToGet; i++) {
            let item;
            if (this.position < this.dataItems.length) {
                item = this.dataItems[this.position];
            } else {
                item = await this.generateDataItem();
                this.dataItems.push(item);
            }
            result.push(item);
            this.position++;
        }
    
        const itemsToCache = this.dataItems.slice(0, this.position);
        await this.saveToIndexedDB(itemsToCache);
    
        this.dataItems = this.dataItems.slice(-10);
    
        return result;
    }
    
}

export default DataSourceEndpoint;
