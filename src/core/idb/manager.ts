import type { IDBData } from "../models/idb.ts";

export class IDBManager {
  private name: string = "momentumDB";
  private version: number = 1;
  private db: IDBDatabase | null = null;
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name, this.version);

      req.onerror = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        reject(`Database error: ${target.error?.message}`);
      };

      req.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });

          store.createIndex("name", "name", { unique: true });
          console.log(`Object Store '${this.storeName}' created.`);
        }
      };
    });
  }

  private async ensureDBOpen(): Promise<void> {
    if (!this.db) {
      await this.open();
    }
  }

  public async add(data: IDBData): Promise<number> {
    await this.ensureDBOpen();

    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db!.transaction(
        [this.storeName],
        "readwrite",
      );
      const store: IDBObjectStore = transaction.objectStore(this.storeName);
      const req: IDBRequest<IDBValidKey> = store.add(data);

      req.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(`Database error: ${target.error?.message}`);
      };

      req.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<IDBValidKey>;
        resolve(target.result as number);
      };
    });
  }

  public async update(data: IDBData): Promise<number> {
    await this.ensureDBOpen();

    if (data.id === 0) {
      throw new Error("Cannot update model without a valid ID.");
    }

    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db!.transaction(
        [this.storeName],
        "readwrite",
      );
      const store: IDBObjectStore = transaction.objectStore(this.storeName);
      const request: IDBRequest<IDBValidKey> = store.put(data);

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(`Database error: ${target.error?.message}`);
      };

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<IDBValidKey>;
        resolve(target.result as number);
      };
    });
  }

  public async getAll(): Promise<IDBData[]> {
    await this.ensureDBOpen();

    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db!.transaction(
        [this.storeName],
        "readonly",
      );
      const store: IDBObjectStore = transaction.objectStore(this.storeName);
      const request: IDBRequest<object[]> = store.getAll();

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(`Database error: ${target.error?.message}`);
      };

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<object[]>;
        resolve(target.result as IDBData[]);
      };
    });
  }

  public async delete(id: number): Promise<void> {
    await this.ensureDBOpen();

    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db!.transaction(
        [this.storeName],
        "readwrite",
      );
      const store: IDBObjectStore = transaction.objectStore(this.storeName);

      const req: IDBRequest<undefined> = store.delete(id);

      req.onsuccess = () => resolve();

      req.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        reject(`Database error: ${target.error?.message}`);
      };
    });
  }
}
