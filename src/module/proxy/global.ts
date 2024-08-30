import { states } from 'minecraft-protocol';

import type Instance from '../../instance/index.js';
import { type RawPacket } from '../../util/packet.js';
import { type Message } from './shared.js';

export default async function (instance: Instance): Promise<void> {
  const clientQueue: RawPacket[] = [];
  const serverQueue: RawPacket[] = [];

  const channel = instance.createChannel<Message>('proxy');

  const client = instance.client;
  const server = instance.server;
  const worker = instance.worker;

  client.on('end', (reason) => {
    console.info('Client disconnected:', reason);

    server.end(reason);

    void worker.terminate();
  });

  server.on('end', (reason) => {
    console.info('Server disconnected:', reason);

    client.end(reason);

    void worker.terminate();
  });

  client.on('error', (error) => {
    console.error('Client error:', error);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  client.on('packet', (data, meta) => {
    // if (meta.state !== states.PLAY) return;

    channel.write({
      direction: 'downstream',
      packet: {
        ...meta,
        data,
      },
    });
  });

  server.on('packet', (data, meta) => {
    // if (meta.state !== states.PLAY) return;

    channel.write({
      direction: 'upstream',
      packet: {
        ...meta,
        data,
      },
    });
  });

  // Flush packet queue on play state

  client.on('state', (state) => {
    if (state !== states.PLAY) return;

    const queue = clientQueue;

    for (const packet of queue) client.write(packet.name, packet.data);

    queue.length = 0;
  });

  server.on('state', (state) => {
    if (state !== states.PLAY) return;

    const queue = serverQueue;

    for (const packet of queue) server.write(packet.name, packet.data);

    queue.length = 0;
  });

  channel.subscribe(({ direction: side, packet }) => {
    switch (side) {
      case 'downstream':
        writeClientPacket(packet);
        break;
      case 'upstream':
        writeServerPacket(packet);
        break;
      default:
        throw new Error(`Invalid side: ${side as any}`);
    }
  });

  function writeClientPacket(packet: RawPacket): void {
    // wait until play state
    if (client.state !== states.PLAY) {
      clientQueue.push(packet);

      return;
    }

    if (packet.state !== states.PLAY) return;

    client.write(packet.name, packet.data);
  }

  function writeServerPacket(packet: RawPacket): void {
    // wait until play state
    if (server.state !== states.PLAY) {
      serverQueue.push(packet);

      return;
    }

    if (packet.state !== states.PLAY) return;

    server.write(packet.name, packet.data);
  }
}
