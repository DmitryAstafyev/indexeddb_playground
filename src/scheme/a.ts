import { sequence } from "../services";

import * as DB from "../controllers/db";

interface IEntity {
	index: number;
	a: string;
	b: string;
	c: string;
	d: string;
	e: string;
	f: string;
	g: string;
}
export class A {
	static getMetadata(): DB.IMetadata {
		return {
			key: "index",
			name: "obj_a",
			indexes: [
				{ path: "a", name: "a", options: { unique: false } },
				{ path: "b", name: "b", options: { unique: false } },
				{ path: "c", name: "c", options: { unique: false } },
				{ path: "d", name: "d", options: { unique: false } },
				{ path: "e", name: "e", options: { unique: false } },
				{ path: "f", name: "f", options: { unique: false } },
				{ path: "g", name: "g", options: { unique: false } },
			],
		};
	}

	static getName(): string {
		return "obj_a";
	}

    public symbols: number = 0;

	public getRandom(): IEntity {
		const tm = Date.now();
		const rand = () => {
			return tm * Math.random();
		};
        const str = () => {
            const s = rand().toString();
            this.symbols += s.length;
			return s;
		};
		return {
			index: sequence.get(),
			a: str(),
			b: str(),
			c: str(),
			d: str(),
			e: str(),
			f: str(),
			g: str(),
		};
	}
}
