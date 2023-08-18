import { Component } from "../component";

export interface ISetter {
	title(title: string): ISetter;
	total(total: number): ISetter;
	bytes(bytes: number): ISetter;
	done(done: number): ISetter;
}

export class ProgressComponent extends Component {
	protected refs: {
		total: HTMLSpanElement | undefined;
		summary: HTMLSpanElement | undefined;
		title: HTMLSpanElement | undefined;
		done: HTMLSpanElement | undefined;
		bytes: HTMLSpanElement | undefined;
	} = {
		total: undefined,
		summary: undefined,
		title: undefined,
		done: undefined,
		bytes: undefined,
	};

	protected total: number = 0;

	constructor() {
		super();
	}

	public selector(): string {
		return "el-progress";
	}

	public html(): string {
		require("./progress.css");
		return require("./progress.html").default;
	}

	public override onMount(): void {
		this.refs.done = this.ref.querySelector("span.done");
		this.refs.total = this.ref.querySelector("span.total");
		this.refs.title = this.ref.querySelector("span.title");
		this.refs.summary = this.ref.querySelector("span.summary");
		this.refs.bytes = this.ref.querySelector("span.bytes");
	}

	public override onUnmount(): void {
		this.refs.done = undefined;
		this.refs.total = undefined;
		this.refs.title = undefined;
		this.refs.summary = undefined;
		this.refs.bytes = undefined;
	}

	public set(): ISetter {
		const setter: ISetter = {
			title: (title: string): ISetter => {
				this.refs.title !== undefined &&
					(this.refs.title.innerHTML = title);
				return setter;
			},
			total: (total: number): ISetter => {
				this.refs.total !== undefined &&
					(this.refs.total.innerHTML = total.toString());
				this.total = total;
				return setter;
			},
			bytes: (bytes: number): ISetter => {
				this.refs.bytes !== undefined &&
					(this.refs.bytes.innerHTML = (bytes / 1024 / 1024).toFixed(
						2
					));
				return setter;
			},
			done: (done: number): ISetter => {
				this.refs.done !== undefined &&
					(this.refs.done.innerHTML = done.toString());
				this.refs.summary !== undefined &&
					(this.refs.summary.innerHTML = `${
						Math.round(done / this.total) * 100
					}%`);
				return setter;
			},
		};
		return setter;
	}

	public onSuccess(callback: () => void) {
		callback();
	}
}
