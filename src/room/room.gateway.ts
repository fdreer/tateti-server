import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { RoomService } from './room.service'
import { getRoomsFromSocket } from './utils'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly log = new Logger(RoomGateway.name)
  @WebSocketServer()
  io: Server

  constructor(private readonly roomService: RoomService) {}

  afterInit() {}

  handleConnection(socket: Socket) {
    this.log.log(`Client connected: ${socket.id}`)
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // const roomId = getRoomsFromSocket(socket) // --> creo que no tiene sala porque ya se desconectó
    // console.log(roomId)
    // this.log.verbose(`RoomID: ${roomId}`)
    // // await socket.leave(roomId)
    // this.log.verbose(`Client disconnected: ${socket.id}`)
    // this.io.to(roomId).emit('room_left')
  }

  @SubscribeMessage('event_create')
  async handleCreateRoom(@ConnectedSocket() socket: Socket) {
    const roomId = await this.roomService.create(socket)
    this.io.to(roomId).emit('room_created', { roomId })
  }

  @SubscribeMessage('event_join')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { roomId: string }
  ) {
    const { roomId } = payload
    this.roomService.join(socket, this.io, roomId)
  }

  @SubscribeMessage('event_leave')
  async handleLeaveRoom(@ConnectedSocket() socket: Socket) {
    // --> creo que no se ejecuta cada vez que un cliente abandona el navegador
    this.log.verbose('Se ejecuta event_leave')
    const roomId = getRoomsFromSocket(socket)[0]
    await socket.leave(roomId)
    this.io.to(roomId).emit('room_left')
  }
}
