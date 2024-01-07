import Instance from './instance/index.js'
import { createServer } from 'minecraft-protocol'

// See: https://nodejs.org/api/worker_threads.html#considerations-when-transferring-typedarrays-and-buffers
Object.assign(Uint8Array.prototype, Buffer.prototype)

const VERSION = '1.19.4'

export const SERVER_OPTIONS = {
  host: '127.0.0.1',
  port: 25565,
  keepAlive: false,
  version: VERSION
}

export const server = createServer(SERVER_OPTIONS)

server.on('login', client => {
  // eslint-disable-next-line no-new
  new Instance(client)
})
