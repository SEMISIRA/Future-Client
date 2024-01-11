import { type Side, type Message } from './shared.js'
import { PublicEventHandler } from '../../util/events.js'
import { createChannel } from '../../worker/parent.js'
import { Packet, type RawPacket } from '../../util/packet.js'
import { type AsyncVoid } from '../../util/types.js'

export type PacketEventMap = Record<string, (packet: Packet) => AsyncVoid>

// ? Should I export the channel
export const channel = createChannel<Message>('proxy')

function write (side: Side, packet: RawPacket): void {
  channel.write({
    side,
    packet
  })
}

export const proxy = {
  client: new PublicEventHandler<PacketEventMap>(),
  server: new PublicEventHandler<PacketEventMap>(),

  writeClient (name: string, data: unknown): void {
    write('client', { name, data })
  },
  writeServer (name: string, data: unknown): void {
    write('server', { name, data })
  }
} as const

channel.subscribe(({ side, packet: raw }: Message) => {
  void (async () => {
    const emitter = proxy[side]

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

export default proxy
