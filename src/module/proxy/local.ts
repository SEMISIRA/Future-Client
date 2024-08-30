import type { States } from 'minecraft-protocol';
import { states } from 'minecraft-protocol';

import { PublicEventHandler } from '../../util/events.js';
import { Packet, type RawPacket } from '../../util/packet.js';
import { type AsyncVoid } from '../../util/types.js';
import { createChannel } from '../../worker/parent.js';
import { type Direction as Direction, type Message } from './shared.js';

export type PacketEventMap = Record<string, (packet: Packet) => AsyncVoid>;

// ? Should I export the channel
export const channel = createChannel<Message>('proxy');

function write(direction: Direction, packet: RawPacket): void {
  channel.write({
    direction,
    packet,
  });
}

export const proxy = {
  client: new PublicEventHandler<PacketEventMap>(),
  server: new PublicEventHandler<PacketEventMap>(),

  writeDownstream(
    name: string,
    data: unknown,
    state: States = states.PLAY,
  ): void {
    write('downstream', { name, data, state });
  },
  writeUpstream(
    name: string,
    data: unknown,
    state: States = states.PLAY,
  ): void {
    write('upstream', { name, data, state });
  },
} as const;

channel.subscribe(({ direction, packet: raw }: Message) => {
  void (async () => {
    const sourceHandler = {
      downstream: proxy.server,
      upstream: proxy.client,
    }[direction];

    const packet = new Packet(raw.name, raw.data);

    await sourceHandler.emit('packet', packet);
    await sourceHandler.emit(packet.name, packet);

    if (packet.canceled) return;

    switch (direction) {
      case 'downstream':
        direction = 'upstream';
        break;
      case 'upstream':
        direction = 'downstream';
        break;
      default:
        throw new Error(`Invalid direction: ${direction as any}`);
    }

    // Forward packet
    channel.write({
      direction,
      packet,
    });
  })();
});

export default proxy;
