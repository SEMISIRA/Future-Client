// _x ->  x
//  x -> _x
export class Channel<T> {
  public readonly id

  constructor (id: string) {
    this.id = id
  }

  private readonly listeners = new Set<(data: T) => void>()

  public subscribe (listener: (data: T) => void): void {
    this.listeners.add(listener)
  }

  public unsubscribe (listener: (data: T) => void): void {
    this.listeners.delete(listener)
  }

  public write (data: T): void {
    for (const listener of this._listeners) {
      listener(data)
    }
  }

  private readonly _listeners = new Set<(data: T) => void>()

  public _subscribe (listener: (data: T) => void): void {
    this._listeners.add(listener)
  }

  public _unsubscribe (listener: (data: T) => void): void {
    this._listeners.delete(listener)
  }

  public _write (data: T): void {
    for (const listener of this.listeners) {
      listener(data)
    }
  }
}
