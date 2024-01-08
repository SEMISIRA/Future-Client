export interface RawPacket {
  name: string
  data: unknown
}

export class Packet<Data = unknown> {
  public name
  public data

  public canceled: boolean = false

  constructor (name: string, data: Data) {
    this.name = name
    this.data = data
  }
}
