import { type Side, type Message } from './shared.js'
import { type AsyncVoid, EventHandler } from '../../util/events.js'
import { createChannel } from '../../worker/parent.js'
import { Packet, type RawPacket } from '../../util/packet.js'

export type EventMap = Record<string, (packet: Packet) => AsyncVoid>

export class EventEmitter extends EventHandler<EventMap> {
  public async emit (name: string, packet: Packet): Promise<void> {
    await this._emit(name, packet)
  }
}

// ? Should I export the channel
export const channel = createChannel<Message>('proxy')

export class Proxy {
  public readonly client = new EventEmitter()
  public readonly server = new EventEmitter()

  constructor () {
    channel.subscribe(({ side, packet: raw }: Message) => {
      void (async () => {
        const emitter = this[side]

        const packet = new Packet(raw.name, raw.data)

        await emitter.emit('packet', packet)
        await emitter.emit(packet.name, packet)

        if (packet.canceled) return

        switch (side) {
          case 'client':
            side = 'server'
            break
          case 'server':
            side = 'client'
            break
          default:
            throw new Error(`Invalid side: ${side as any}`)
        }

        channel.write({
          side,
          packet
        })
      })()
    })
  }

  protected write (side: Side, packet: RawPacket): void {
    channel.write({
      side,
      packet
    })
  }

  public writeClient (name: string, data: unknown): void {
    this.write('client', { name, data })
  }

  public writeServer (name: string, data: unknown): void {
    this.write('server', { name, data })
  }
}

export default new Proxy()
