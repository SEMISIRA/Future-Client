export type Listener<T> = (data: T) => void

// _x ->  x
//  x -> _x
export class Channel<TSend, TReceive = TSend> {
  public readonly id

  constructor (id: string) {
    this.id = id
  }

  private readonly listeners = new Set<Listener<TReceive>>()

  public subscribe (listener: Listener<TReceive>): void {
    this.listeners.add(listener)
  }

  public unsubscribe (listener: Listener<TReceive>): void {
    this.listeners.delete(listener)
  }

  public write (data: TSend): void {
    for (const listener of this._listeners) {
      listener(data)
    }
  }

  private readonly _listeners = new Set<Listener<TSend>>()

  public _subscribe (listener: Listener<TSend>): void {
    this._listeners.add(listener)
  }

  public _unsubscribe (listener: Listener<TSend>): void {
    this._listeners.delete(listener)
  }

  public _write (data: TReceive): void {
    for (const listener of this.listeners) {
      listener(data)
    }
  }
}
