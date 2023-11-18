import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { assignRandomProperties, getRoomsFromSocket } from './utils'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  private readonly log = new Logger(GameGateway.name)
  @WebSocketServer()
  io: Server

  @SubscribeMessage('update_game')
  public async updateGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = getRoomsFromSocket(socket)
    socket.to(gameRoom).emit('on_game_update', message)
  }

  @SubscribeMessage('reset_board')
  public async resetBoard(@ConnectedSocket() socket: Socket) {
    const gameRoom = getRoomsFromSocket(socket)
    const randomProperties = assignRandomProperties()

    socket.emit('on_reset_board', randomProperties[0])
    socket.to(gameRoom).emit('on_reset_board', randomProperties[1])
  }
}
