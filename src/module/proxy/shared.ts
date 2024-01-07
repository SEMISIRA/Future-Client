import { type RawPacket } from '../../util/packet.js'

export type Side = 'client' | 'server'

export interface Message {
  side: Side
  packet: RawPacket
}
