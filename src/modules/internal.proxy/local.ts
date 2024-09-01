import type { EventMap } from '../../util/events.js';
import { PublicEventHandler } from '../../util/events.js';
import { Packet, type RawPacket } from '../../util/packet.js';
import { type AsyncVoid } from '../../util/types.js';
import { createChannel } from '../../worker/parent.js';
import { type Direction as Direction, type Message } from './shared.js';

export type PacketEventMap = Record<string, (packet: Packet) => AsyncVoid>;

const channel = createChannel<Message>('internal.proxy');

function write(direction: Direction, packet: RawPacket): void {
  channel.write({
    direction,
    packet,
  });
}

class ConnectionSide<
  TEventMap extends EventMap<TEventMap>,
> extends PublicEventHandler<TEventMap> {
  constructor(protected readonly direction: Direction) {
    super();
  }

  public write(packet: Packet): void {
    write(this.direction, packet);
  }
}

// ngl I feel like I need rx soo bad
// then I could just do
// channel.filter(({ direction }) => direction === 'downstream')
// and it would just work

export const proxy = {
  upstream: new ConnectionSide<PacketEventMap>('upstream'),
  downstream: new ConnectionSide<PacketEventMap>('downstream'),
} as const;

channel.subscribe(({ direction, packet: raw }: Message) => {
  void (async () => {
    const connection = proxy[direction];

    const packet = new Packet(raw.name, raw.data, raw.state);

    await connection.emit('packet', packet);
    await connection.emit(packet.name, packet);

    if (packet.canceled) return;

    // Forward packet
    channel.write({
      direction,
      packet,
    });
  })();
});

export default proxy;
