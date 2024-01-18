import Instance from './instance/index.js'
import { SERVER_OPTIONS } from './settings.js'
import { createServer } from 'minecraft-protocol'

// See: https://nodejs.org/api/worker_threads.html#considerations-when-transferring-typedarrays-and-buffers
Object.assign(Uint8Array.prototype, Buffer.prototype)

export const server = createServer({
  'online-mode': false,
  ...SERVER_OPTIONS,
  keepAlive: false
})

server.on('login', client => {
  console.info(`${client.username} has connected!`)

  // eslint-disable-next-line no-new
  new Instance(client)
})
