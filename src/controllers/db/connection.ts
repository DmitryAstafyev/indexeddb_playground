import { IIndexMetadata, IMetadata } from "./metadata";

export class Connection {
	protected ref: IDBDatabase | undefined;

	protected db(): IDBDatabase {
		if (this.ref === undefined) {
			throw new Error(`Attempt to connect to not connected DB`);
		}
		return this.ref;
	}

	protected write(store: IDBObjectStore, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = store.add(value);
			const onSuccess = () => {
				unbind();
				resolve();
			};
			const onError = () => {
				console.error(`on request error`);
				reject(new Error(`Fail to make write request`));
			};
			const bind = () => {
				request.addEventListener("success", onSuccess);
				request.addEventListener("error", onError);
			};
			const unbind = () => {
				request.removeEventListener("success", onSuccess);
				request.addEventListener("error", onError);
			};
			bind();
		});
	}

	constructor(
		protected readonly name: string,
		protected readonly version: number,
		protected readonly metadata: Map<string, IMetadata>
	) {}

	public destroy() {
		if (this.ref === undefined) {
			return;
		}
		this.ref.close();
	}

	public connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = window.indexedDB.open(this.name, this.version);
			const onUpgradeneeded = (event: IDBVersionChangeEvent) => {
				const ref: IDBDatabase = (event.target as any).result;
				if (ref === undefined) {
					throw new Error(`Fail to get reference to DB`);
				}
				this.metadata.forEach((md: IMetadata, key: string) => {
					const store = ref.createObjectStore(md.name, {
						keyPath: md.key,
					});
					md.indexes.forEach((index: IIndexMetadata) => {
						store.createIndex(
							index.name,
							index.path,
							index.options
						);
					});
				});
			};
			const onSuccess = (_event: Event) => {
				unbind();
				this.ref = request.result;
				resolve();
			};
			const onError = (_event: Event) => {
				unbind();
				reject(new Error(`Fail to connect`));
			};
			const bind = () => {
				request.addEventListener("upgradeneeded", onUpgradeneeded);
				request.addEventListener("success", onSuccess);
				request.addEventListener("error", onError);
			};
			const unbind = () => {
				request.removeEventListener("upgradeneeded", onUpgradeneeded);
				request.removeEventListener("success", onSuccess);
				request.removeEventListener("error", onError);
			};
			bind();
		});
	}

	public insert(
		name: string,
		values: any[],
		requestDone?: () => void
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const transaction = this.db().transaction([name], "readwrite");
			const store: IDBObjectStore = transaction.objectStore(name);
			Promise.allSettled(
				values.map((value) =>
					this.write(store, value).then(() => {
						requestDone !== undefined && requestDone();
					})
				)
			).catch((err: Error) => {
				console.error(`Fail to write some request`);
			});
			const onComplete = () => {
				unbind();
				resolve();
			};
			const onError = () => {
				unbind();
				reject(new Error(`Fail to write into DB`));
			};
			const bind = () => {
				transaction.addEventListener("complete", onComplete);
				transaction.addEventListener("error", onError);
			};
			const unbind = () => {
				transaction.removeEventListener("complete", onComplete);
				transaction.removeEventListener("error", onError);
			};
			bind();
		});
	}
}
