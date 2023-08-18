import * as DB from "./controllers/db";
import * as Scheme from "./scheme";
import * as Env from "./env";

import { ProgressComponent } from "./components/progress/progress";

const COUNT_OF_OBJECTS = 1000;

class Application {
	public async run(): Promise<void> {
		const progress = new ProgressComponent();
		progress.mount(document.body);
		progress
			.set()
			.title("Writing objects")
			.total(COUNT_OF_OBJECTS * 2)
			.done(0);
		const metadata: Map<string, DB.IMetadata> = new Map();
		metadata.set(Scheme.A.getName(), Scheme.A.getMetadata());
		metadata.set(Scheme.B.getName(), Scheme.B.getMetadata());
		const db = new DB.Connection("my_db_test", 1, metadata);
		await db.connect();
		let measure = Env.measure("creating random objects A");
		let collection = [];
		let done = 0;
		const a = new Scheme.A();
		for (let i = COUNT_OF_OBJECTS; i >= 0; i -= 1) {
			collection.push(a.getRandom());
		}
		measure();
		measure = Env.measure(`recording objects A (${a.symbols} bytes)`);
		await db.insert(Scheme.A.getName(), collection, () => {
			done += 1;
			progress.set().done(done).bytes(a.symbols);
		});
		measure();

		measure = Env.measure("creating random objects B");
		collection = [];
		const b = new Scheme.B();
		for (let i = COUNT_OF_OBJECTS; i >= 0; i -= 1) {
			collection.push(b.getRandom());
		}
		measure();
		measure = Env.measure(`recording objects B (${b.symbols} bytes)`);
		await db.insert(Scheme.A.getName(), collection, () => {
			done += 1;
			progress
				.set()
				.done(done)
				.bytes(a.symbols + b.symbols);
		});
		measure();
		console.log(`All done`);
	}
}

new Application().run().catch((err: Error) => {
	console.error(err.message);
});
