import { type ClientOptions, type ServerOptions } from 'minecraft-protocol'

export const VERSION = '1.19.4'

interface TargetOptions extends Omit<ClientOptions, 'username'> {
  username?: ClientOptions['username']
}

export const TARGET_OPTIONS: TargetOptions = {
  host: 'kaboom.pw',
  port: 25565,
  // username: 'RealDinhero21',
  // auth: 'microsoft',
  version: VERSION
}

export const SERVER_OPTIONS: ServerOptions = {
  host: '127.0.0.1',
  port: 25565,
  version: VERSION
}
