import { type RawPacket } from '../../util/packet.js';

export type Direction = 'upstream' | 'downstream';

export interface Message {
  direction: Direction;
  packet: RawPacket;
}
