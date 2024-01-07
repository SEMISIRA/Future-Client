// import { type UUID } from 'crypto'
// import { type AsyncVoid, EventHandler } from '../../util/events.js'
// import { type Packet } from '../util/packet.js'
// import proxy from './proxy.js'

// export type i64 = [number, number]

// export interface ClientChatPacketData {
//   timestamp: i64
//   salt: i64
//   acknowledged: Uint8Array
// }

// export type Signature = Uint8Array

// export interface ClientChatMessagePacketData extends ClientChatPacketData {
//   message: string
//   signature: Signature | undefined
//   offset: number
// }

// export interface ClientChatCommandPacketData extends ClientChatPacketData {
//   command: string
//   argumentSignatures: Signature[]
//   messageCount: number
// }

// export interface ProfileLessChatPacketData {
//   message: string
//   type: number
//   name: string
//   // TODO: find out what target is supposed to be
//   target: undefined
// }

// export interface PlayerChatPacketData {
//   senderUuid: UUID
//   index: number
//   signature: Signature | undefined
//   plainMessage: string
//   timestamp: i64
//   salt: i64
//   // TODO: find out what previousMessages is supposed to be
//   previousMessages: never[]
//   unsignedChatContent: string
//   filterType: number
//   // TODO: Find out what filterTypeMask is supposed to be
//   filterTypeMask: undefined
//   type: number
//   networkName: string
//   // TODO: find out what networkTargetName is supposed to be
//   networkTargetName: undefined
// }

// export interface SystemChatPacketData {
//   content: string
//   isActionBar: boolean
// }

// export interface ChatEventMap {
//   'client.command': (packet: Packet<ClientChatCommandPacketData>) => AsyncVoid
//   'client.message': (packet: Packet<ClientChatMessagePacketData>) => AsyncVoid

//   'server.profiless': (packet: Packet<ProfileLessChatPacketData>) => AsyncVoid
//   'server.player': (packet: Packet<PlayerChatPacketData>) => AsyncVoid
//   'server.system': (packet: Packet<SystemChatPacketData>) => AsyncVoid
// }

// export class Chat extends EventHandler<ChatEventMap> {
//   constructor () {
//     super()

//     proxy.client.on('chat_command', async packet => {
//       await this._emit('client.command', packet as Packet<ClientChatCommandPacketData>)
//     })

//     proxy.client.on('chat_message', async packet => {
//       await this._emit('client.message', packet as Packet<ClientChatMessagePacketData>)
//     })

//     proxy.server.on('profileless_chat', async packet => {
//       await this._emit('server.profiless', packet as Packet<ProfileLessChatPacketData>)
//     })

//     proxy.server.on('player_chat', async packet => {
//       await this._emit('server.player', packet as Packet<PlayerChatPacketData>)
//     })

//     proxy.server.on('system_chat', async packet => {
//       await this._emit('server.system', packet as Packet<SystemChatPacketData>)
//     })
//   }

//   // // TODO: Fix
//   // public writeClientCommand (command: string): void {
//   //   proxy.writeClient('chat_command', { command })
//   // }

//   // public writeClientMessage (message: string): void {
//   //   proxy.writeClient('chat_message', { message })
//   // }
// }

// export default new Chat()
