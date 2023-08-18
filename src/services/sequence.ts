export class Sequence {
	protected sequence: number = 0;

	public get(): number {
		return this.sequence++;
	}
}

export const sequence = new Sequence();
