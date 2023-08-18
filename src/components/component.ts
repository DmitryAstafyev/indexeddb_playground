export abstract class Component {
  abstract html(): string;
  abstract selector(): string;

  public onMount(): void {
    return undefined;
  }

  public onUnmount(): void {
    return undefined;
  }

  protected ref: HTMLElement | undefined;

  public mount(owner: HTMLElement): void {
    if (this.ref !== undefined) {
      // component already mount
      return;
    }
    const parent = document.createElement(this.selector());
    parent.innerHTML = this.html();
    owner.appendChild(parent);
    this.ref = parent;
    this.onMount();
  }

  public unmount(): void {
    if (this.ref === undefined) {
      return;
    }
    this.ref.parentNode !== null && this.ref.parentNode.removeChild(this.ref);
    this.ref = undefined;
    this.onUnmount();
  }
}
