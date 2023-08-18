export interface IMetadata {
	key: string;
	name: string;
	indexes: IIndexMetadata[];
}

export interface IIndexMetadata {
	name: string;
	path: string | string[];
	options: IDBIndexParameters;
}
