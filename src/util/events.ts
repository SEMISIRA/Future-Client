export type AsyncVoid = void | Promise<void>

export type EventMap<T> = { [K in keyof T]: (...args: any[]) => AsyncVoid }

export class EventHandler<T extends EventMap<T>> {
  protected map = new Map<keyof T, Set<T[keyof T]>>()

  protected async _emit<E extends keyof T> (name: E, ...data: Parameters<T[E]>): Promise<void> {
    const map = this.map

    const set = map.get(name)

    if (set === undefined) return

    for (const listener of set) await listener(...data)
  }

  public on<E extends keyof T> (name: E, callback: T[E]): void {
    const map = this.map

    const set = map.get(name) ?? new Set()
    map.set(name, set)

    set.add(callback)
  }

  public off<E extends keyof T> (name: E, callback: T[E]): void {
    const map = this.map

    const set = map.get(name)

    if (set === undefined) return

    set.delete(callback)
  }

  public clear (): void {
    const map = this.map

    map.clear()
  }
}
