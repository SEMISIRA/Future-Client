import { createClient, createServer, states } from 'minecraft-protocol'

interface RawPacket {
  name: string
  data: unknown
}

const VERSION = '1.19.4'

const SERVER = {
  host: '127.0.0.1',
  port: 25565,
  keepAlive: false,
  version: VERSION
}

const TARGET = {
  host: 'kaboom.pw',
  port: 25565,
  keepAlive: false,
  username: 'Player137',
  version: VERSION
}

const server = createServer(SERVER)

server.on('login', client => {
  const target = createClient(TARGET)

  client.on('end', reason => {
    console.info('Client disconnected:', reason)

    target.end(reason)
  })

  target.on('end', reason => {
    console.info('Target disconnected:', reason)

    client.end(reason)
  })

  client.on('error', error => {
    console.error('Client error:', error)
  })

  target.on('error', error => {
    console.error('Target error:', error)
  })

  client.on('packet', (data, meta) => {
    if (meta.state !== states.PLAY) return

    sendTargetPacket({
      name: meta.name,
      data
    })
  })

  target.on('packet', (data, meta) => {
    if (meta.state !== states.PLAY) return

    sendClientPacket({
      name: meta.name,
      data
    })
  })

  const CLIENT_QUEUE: RawPacket[] = []
  const TARGET_QUEUE: RawPacket[] = []

  client.on('state', state => {
    if (state !== states.PLAY) return

    for (const packet of CLIENT_QUEUE) client.write(packet.name, packet.data)

    CLIENT_QUEUE.length = 0
  })

  target.on('state', state => {
    if (state !== states.PLAY) return

    for (const packet of TARGET_QUEUE) target.write(packet.name, packet.data)

    TARGET_QUEUE.length = 0
  })

  function sendClientPacket (packet: RawPacket): void {
    if (client.state !== states.PLAY) {
      CLIENT_QUEUE.push(packet)

      return
    }

    client.write(
      packet.name,
      packet.data
    )
  }

  function sendTargetPacket (packet: RawPacket): void {
    if (target.state !== states.PLAY) {
      TARGET_QUEUE.push(packet)

      return
    }

    target.write(
      packet.name,
      packet.data
    )
  }
})
