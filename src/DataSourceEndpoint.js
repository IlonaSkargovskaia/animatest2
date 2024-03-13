class DataSourceEndpoint {
    constructor() {
        this.dataItems = [];
        this.position = 0;
    }

    generateDataItem() {
        const randomNum = Math.floor(Math.random() * 1000);
        const url = `https://picsum.photos/600/450?random=${randomNum}`;
        const creationDate = new Date().toISOString();
        const dataItem = { url, creationDate };
        return dataItem;
    }

    getNextDataItems(numberOfItemsToGet) {
        let result = [];
        if (numberOfItemsToGet <= 0) {
            return result;
        }

        for (let i = 0; i < numberOfItemsToGet; i++) {
            if (this.position >= this.dataItems.length) {
                const newItem = this.generateDataItem();
                this.dataItems.push(newItem);
            }
            result.push(this.dataItems[this.position]);
            this.position++;
        }
        return result;
    }

}

export default DataSourceEndpoint;
