export function measure(label: string): () => void {
	const started = Date.now();
	return () => {
		console.log(`${label} done in ${Date.now() - started} ms`);
	};
}
