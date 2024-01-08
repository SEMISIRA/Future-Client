import { type Message } from '../worker/parent.js'
import { importModulesGenerator } from '../util/import-modules.js'
import { Channel } from '../util/channel.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { createClient, type ServerClient } from 'minecraft-protocol'

if (!('require' in globalThis)) {
  globalThis.__filename = fileURLToPath(import.meta.url)
  globalThis.__dirname = dirname(__filename)
}

const WORKER_PATH = resolve(__dirname, '../worker')
const MODULE_DIR_PATH = resolve(__dirname, '../module')

const VERSION = '1.19.4'

export const TARGET_OPTIONS = {
  host: 'kaboom.pw',
  port: 25565,
  keepAlive: false,
  username: 'Player137',
  version: VERSION
}

export class Instance {
  public readonly client
  public readonly server
  public readonly worker

  constructor (client: ServerClient) {
    this.client = client

    const target = createClient(TARGET_OPTIONS)
    this.server = target

    target.on('error', error => {
      console.error('Target error:', error)
    })

    const worker = new Worker(WORKER_PATH)
    this.worker = worker

    worker.on('error', error => {
      console.error('Worker error:', error)
    })

    void this._importModules()
  }

  private async _importModules (): Promise<void> {
    for await (const module of importModulesGenerator(MODULE_DIR_PATH, 'global.js')) {
      if (module === null) throw new Error('Expected module not to be null')
      if (typeof module !== 'object') throw new Error('Expected module to be an object')

      if (!('default' in module)) throw new Error('Expected default export')

      const f = module.default

      if (typeof f !== 'function') throw new Error('Expected default export to be a function')

      await (f as (instance: Instance) => Promise<void>)(this)
    }
  }

  protected postMessage (channel: string, data: any): void {
    this.worker.postMessage({
      channel,
      data
    } satisfies Message)
  }

  public createChannel<TSend, TReceive = TSend> (id: string): Channel<TSend, TReceive> {
    const channel = new Channel<TSend, TReceive>(id)

    channel._subscribe(data => {
      this.postMessage(id, data)
    })

    this.worker.on('message', (message: Message<TReceive>) => {
      if (message.channel !== id) return

      channel._write(message.data)
    })

    return channel
  }
}

export default Instance
