import { parentPort } from 'worker_threads';

import { Channel } from '../util/channel.js';

if (parentPort === null) throw new Error('Must run in worker thread');

const port = parentPort;

export interface Message<T = any> {
  channel: string;
  data: T;
}

function postMessage(channel: string, data: any): void {
  port.postMessage({
    channel,
    data,
  });
}

export function createChannel<TSend, TReceive = TSend>(
  id: string,
): Channel<TSend, TReceive> {
  const channel = new Channel<TSend, TReceive>(id);

  channel._subscribe((message) => {
    postMessage(id, message);
  });

  port.on('message', (message: Message<TReceive>) => {
    if (message.channel !== id) return;

    channel._write(message.data);
  });

  return channel;
}
