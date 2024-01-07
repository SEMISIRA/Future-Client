export interface RawPacket {
  name: string
  data: unknown
}

export class Packet<T = unknown> {
  public name
  public data

  public canceled: boolean = false

  constructor (name: string, data: T) {
    this.name = name
    this.data = data
  }
}
