export class DataQueue {
  private queue: any[] = [];

  constructor(item?: any) {
    if (item) {
      this.enqueue(item);
    }
  }

  public enqueue(item: any): void {
    this.queue.push(item);
  }

  public dequeue(): any {
    return this.queue.shift();
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public peek(): any {
    return this.isEmpty ? undefined : this.queue[0];
  }

  public size(): number {
    return this.queue.length;
  }

  public toString(): string {
    let rv = '';
    this.queue.forEach((item: any, i: number) => {
      rv += item.toString();
      if (i < this.queue.length -1) {
        rv += ', ';
      }
    });

    return rv;
  }
}
