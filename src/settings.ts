import { type ClientOptions, type ServerOptions } from 'minecraft-protocol';

export const VERSION = '1.19.4';

export const TARGET_HOST = process.env.HOST;
export const TARGET_PORT = parseInt(process.env.PORT ?? '25565');

interface TargetOptions extends Omit<ClientOptions, 'username'> {
  username?: ClientOptions['username'];
}

export const TARGET_OPTIONS: TargetOptions = {
  host: TARGET_HOST,
  port: TARGET_PORT,
  // username: 'RealDinhero21',
  // auth: 'microsoft',
  version: VERSION,
};

export const SERVER_OPTIONS: ServerOptions = {
  host: '127.0.0.1',
  port: 25565,
  version: VERSION,
};
