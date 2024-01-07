import type Instance from '../../instance/index.js'
import { type Message } from './shared.js'
import { type RawPacket } from '../../util/packet.js'
import { states } from 'minecraft-protocol'

export default async function (instance: Instance): Promise<void> {
  const clientQueue: RawPacket[] = []
  const serverQueue: RawPacket[] = []

  const channel = instance.createChannel<Message>('proxy')

  const client = instance.client
  const server = instance.server
  const worker = instance.worker

  client.on('end', reason => {
    console.info('Client disconnected:', reason)

    server.end(reason)

    void worker.terminate()
  })

  server.on('end', reason => {
    console.info('Target disconnected:', reason)

    client.end(reason)

    void worker.terminate()
  })

  client.on('error', error => {
    console.error('Client error:', error)
  })

  server.on('error', error => {
    console.error('Target error:', error)
  })

  client.on('packet', (data, meta) => {
    if (meta.state !== states.PLAY) return

    channel.write({
      side: 'client',
      packet: {
        name: meta.name,
        data
      }
    })
  })

  server.on('packet', (data, meta) => {
    if (meta.state !== states.PLAY) return

    channel.write({
      side: 'server',
      packet: {
        name: meta.name,
        data
      }
    })
  })

  client.on('state', state => {
    if (state !== states.PLAY) return

    const queue = clientQueue

    for (const packet of queue) client.write(packet.name, packet.data)

    queue.length = 0
  })

  server.on('state', state => {
    if (state !== states.PLAY) return

    const queue = serverQueue

    for (const packet of queue) server.write(packet.name, packet.data)

    queue.length = 0
  })

  channel.subscribe(({ side, packet }) => {
    switch (side) {
      case 'client':
        writeClientPacket(packet)
        break
      case 'server':
        writeServerPacket(packet)
        break
      default:
        throw new Error(`Invalid side: ${side as any}`)
    }
  })

  function writeClientPacket (packet: RawPacket): void {
    if (client.state !== states.PLAY) {
      clientQueue.push(packet)

      return
    }

    client.write(
      packet.name,
      packet.data
    )
  }

  function writeServerPacket (packet: RawPacket): void {
    if (server.state !== states.PLAY) {
      serverQueue.push(packet)

      return
    }

    server.write(
      packet.name,
      packet.data
    )
  }
}
