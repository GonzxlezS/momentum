import { Countdown } from "../models/countdown.js";

export class DBManager {
    constructor() {
        this.name = "momentumDB";
        this.version = 1;
        this.db = null;

        //this.habitsStoreName = "habits";
        this.countdownStoreName = "countdown";
    }

    async open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.name, this.version);

            req.onerror = (event) => {
                reject(`Database error: ${event.target.error?.message}`);
            };

            req.onupgradeneeded = (event) => {
                const db = event.target.result;

                /*
                if (!db.objectStoreNames.contains(this.habitsStoreName)) {
                    const habitsStore = db.createObjectStore(
                        this.habitsStoreName, 
                        { 
                            keyPath: 'id',
                            autoIncrement: true 
                        }
                    );

                    habitsStore.createIndex('name', 'name', { unique: true });
                }
                */

                if (!db.objectStoreNames.contains(this.countdownStoreName)) {
                    const countdownStore = db.createObjectStore(
                        this.countdownStoreName, 
                        { 
                            keyPath: 'id',
                            autoIncrement: true 
                        }
                    );
                    
                    countdownStore.createIndex('name', 'name', { unique: true });
                }
            };

            req.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
        });
    }

    async addCountdown(countdownData) {
        if (!this.db) {
            await this.open();
        }
        return new Promise((resolve, reject) => {
            if (!(countdownData instanceof Countdown)) {
                const err = new TypeError("The parameter 'countdownData' must be an instance of the 'Countdown' class.");
                reject(err);
                return;
            }

            countdownData.validate();
 
            const transaction = this.db.transaction([this.countdownStoreName], 'readwrite');
            const store = transaction.objectStore(this.countdownStoreName);
            const req = store.add({
                "name": countdownData.name,
                "date": countdownData.date,
                "emoji": countdownData.emoji,
                "color": countdownData.color
            });

            req.onerror = (event) => {
                reject(`Database error: ${event.target.error?.message}`);
            };

            req.onsuccess = (event) => {
                resolve(event.target.result);
            }          
        });
    }

    async getAllCountdown() {
        if (!this.db) {
            await this.open();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.countdownStoreName], 'readonly');
            const store = transaction.objectStore(this.countdownStoreName);
            const request = store.getAll();

            request.onerror = (event) => {
                reject(`Database error: ${event.target.error?.message}`);
            };

            request.onsuccess = (event) => {
                const data = event.target.result;
                const countdowns = data.map(data => Countdown.fromObject(data));
                resolve(countdowns);
            };
        });
    }

    async updateCountdown(countdownData) {
        if (!this.db) {
            await this.open();
        }

        return new Promise((resolve, reject) => {
            countdownData.validate();

            const transaction = this.db.transaction([this.countdownStoreName], 'readwrite');
            const store = transaction.objectStore(this.countdownStoreName);
            const getReq = store.get(countdownData.ID());

            getReq.onerror = (event) => {
                reject(`Database error: ${event.target.error?.message}`);
            };

            getReq.onsuccess = (event) => {
                const countdown = Countdown.fromObject(event.target.result);
                if (!countdown) {
                    resolve();
                    return;
                }

                for (const prop in countdownData) {
                    if (prop === 'id') continue;

                    if (countdownData[prop] !== null && typeof countdownData[prop] !== 'undefined') {
                        countdown[prop] = countdownData[prop];
                    }
                }

                const putRequest = store.put({
                    "id": countdown.ID(),
                    "name": countdown.name,
                    "date": countdown.date,
                    "emoji": countdown.emoji,
                    "color": countdown.color
                });

                putRequest.onerror = (putEvent) => {
                    reject(`Database error: ${putEvent.target.error?.message}`);
                };

                putRequest.onsuccess = (putEvent) => {
                    resolve(putEvent.target.result);
                };
            };
        });
    }

    async deleteCountdown(id) {
        if (!this.db) {
            await this.open();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.countdownStoreName], 'readwrite');
            const store = transaction.objectStore(this.countdownStoreName);
            const req = store.delete(id);

            req.onsuccess = () => resolve();
            
            req.onerror = (event) => {
                reject(`Database error: ${event.target.error?.message}`);
            };
        });
    }
}