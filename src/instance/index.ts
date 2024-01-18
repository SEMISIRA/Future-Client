import { type Message } from '../worker/parent.js'
import { importModulesGenerator } from '../util/import-modules.js'
import { Channel } from '../util/channel.js'
import { TARGET_OPTIONS } from '../settings.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { createClient, type ServerClient } from 'minecraft-protocol'
import chalk from 'chalk'

if (!('require' in globalThis)) {
  globalThis.__filename = fileURLToPath(import.meta.url)
  globalThis.__dirname = dirname(__filename)
}

const WORKER_PATH = resolve(__dirname, '../worker')
const MODULE_DIR_PATH = resolve(__dirname, '../module')

export class Instance {
  public readonly client
  public readonly server
  public readonly worker

  constructor (client: ServerClient) {
    this.client = client

    const target = createClient({
      auth: 'offline',
      username: client.username,
      ...TARGET_OPTIONS,
      keepAlive: false
    })

    this.server = target

    target.on('error', error => {
      console.error('Target error:', error)
    })

    console.info('Initializing worker... (local context)')

    const start = performance.now()

    const worker = new Worker(WORKER_PATH)
    this.worker = worker

    worker.on('online', () => {
      const end = performance.now()

      const delta = end - start

      console.info(`Worker online! took ${delta.toFixed(2)}ms`)
    })

    worker.on('error', error => {
      console.error('Worker error:', error)
    })

    void this._importModules()
  }

  private async _importModules (): Promise<void> {
    console.group('Loading modules... (global)')

    const start = performance.now()

    let moduleStart = NaN

    for await (const module of importModulesGenerator(
      MODULE_DIR_PATH,
      'global.js',
      {
        pre (entry) {
          const now = performance.now()
          moduleStart = now

          const module = entry.name
          console.group(`Loading ${module}...`)
        },
        post (entry) {
          const now = performance.now()
          const delta = now - moduleStart

          console.groupEnd()
          console.info(`took ${delta.toPrecision(2)}ms`)
        },
        error (error, entry) {
          const module = entry.name

          error.stack += `\n    while loading module ${JSON.stringify(module)} (local)`

          console.error(chalk.red(error.stack))
        }
      }
    )) {
      if (module === null) throw new Error('Expected module not to be null')
      if (typeof module !== 'object') throw new Error('Expected module to be an object')

      if (!('default' in module)) throw new Error('Expected default export')

      const f = module.default

      if (typeof f !== 'function') throw new Error('Expected default export to be a function')

      await (f as (instance: Instance) => Promise<void>)(this)
    }

    const end = performance.now()

    const delta = end - start

    console.groupEnd()
    console.info(`took ${delta.toFixed(2)}ms`)
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
