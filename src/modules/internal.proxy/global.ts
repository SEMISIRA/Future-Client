import { states } from 'minecraft-protocol';

import type Instance from '../../instance/index.js';
import { type RawPacket } from '../../util/packet.js';
import { type Message } from './shared.js';

export default async function (instance: Instance): Promise<void> {
  const downstreamQueue: RawPacket[] = [];
  const upstreamQueue: RawPacket[] = [];

  const channel = instance.createChannel<Message>('internal.proxy');

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
    channel.write({
      direction: 'upstream',
      packet: {
        ...meta,
        data,
      },
    });
  });

  server.on('packet', (data, meta) => {
    channel.write({
      direction: 'downstream',
      packet: {
        ...meta,
        data,
      },
    });
  });

  // Flush packet queue on play state

  client.on('state', (state) => {
    if (state !== states.PLAY) return;

    for (const packet of downstreamQueue) writeDownstreamPacket(packet);

    downstreamQueue.length = 0;
  });

  server.on('state', (state) => {
    if (state !== states.PLAY) return;

    for (const packet of upstreamQueue) writeUpstreamPacket(packet);

    upstreamQueue.length = 0;
  });

  channel.subscribe(({ direction: direction, packet }) => {
    switch (direction) {
      case 'downstream':
        writeDownstreamPacket(packet);
        break;
      case 'upstream':
        writeUpstreamPacket(packet);
        break;
      default:
        throw new Error(`Unknown direction: ${direction as any}`);
    }
  });

  function writeDownstreamPacket(packet: RawPacket): void {
    // queue until play state
    if (client.state !== states.PLAY) {
      downstreamQueue.push(packet);

      return;
    }

    if (packet.state !== states.PLAY) return;

    client.write(packet.name, packet.data);
  }

  function writeUpstreamPacket(packet: RawPacket): void {
    // queue until play state
    if (server.state !== states.PLAY) {
      upstreamQueue.push(packet);

      return;
    }

    if (packet.state !== states.PLAY) return;

    server.write(packet.name, packet.data);
  }
}
