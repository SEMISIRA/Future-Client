import type { PacketMeta, States } from 'minecraft-protocol';
import { states } from 'minecraft-protocol';

export interface RawPacket extends PacketMeta {
  data: unknown;
}

export class Packet<Data = unknown> {
  public name;
  public state: States = states.PLAY;
  public data;

  public canceled: boolean = false;

  constructor(name: string, data: Data) {
    this.name = name;
    this.data = data;
  }
}
