import { type AsyncVoid } from './types.js'

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

  public once<E extends keyof T>(name: E, callback: T[E]): void {
    const original = callback
    callback = function (this: ThisParameterType<T[E]>, ...args: Parameters<T[E]>): ReturnType<T[E]> {
      const output = original.apply(this, args)

      return output as ReturnType<T[E]>
    } as unknown as T[E]

    this.on(name, callback)
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

export class PublicEventHandler<T extends EventMap<T>> extends EventHandler<T> {
  public async emit<E extends keyof T> (name: E, ...data: Parameters<T[E]>): Promise<void> {
    await this._emit(name, ...data)
  }
}
