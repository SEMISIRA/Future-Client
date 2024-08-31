import type { PacketMeta, States } from 'minecraft-protocol';
import { states } from 'minecraft-protocol';

export interface RawPacket extends PacketMeta {
  data: unknown;
}

export class Packet<Data = unknown> {
  public canceled: boolean = false;

  constructor(
    public name: string,
    public data: Data,
    public state: States = states.PLAY,
  ) {}
}
