import { Channel } from '../util/channel.js'
import { parentPort } from 'worker_threads'

if (parentPort === null) throw new Error('Must run in worker thread')

const port = parentPort

export interface Message<T = any> {
  channel: string
  data: T
}

function postMessage (channel: string, data: any): void {
  port.postMessage({
    channel,
    data
  })
}

export function createChannel<T> (id: string): Channel<T> {
  const channel = new Channel<T>(id)

  channel._subscribe(message => {
    postMessage(id, message)
  })

  port.on('message', (message: Message<T>) => {
    if (message.channel !== id) return

    channel._write(message.data)
  })

  return channel
}
