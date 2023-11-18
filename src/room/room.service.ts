import { Injectable, Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { assignRandomProperties, getRoomsFromSocket } from './utils'

@Injectable()
export class RoomService {
  private readonly log = new Logger(RoomService.name)

  async create(socket: Socket) {
    const roomId = crypto.randomUUID().split('-')[0]
    await socket.join(roomId)
    return roomId
  }

  async join(socket: Socket, io: Server, roomId: string) {
    const connectedSockets = io.sockets.adapter.rooms.get(roomId) //--> lista de sockets conectados a la sala
    const socketRooms = getRoomsFromSocket(socket)

    if (socketRooms.length > 0) {
      socket.emit('room_join_error', {
        error: 'No puedes unirte. Ya estás en una sala!'
      })
      return
    }

    if (connectedSockets && connectedSockets.size === 2) {
      socket.emit('room_join_error', {
        error: 'La sala ya está llena'
      })
      return
    }

    await socket.join(roomId)
    socket.emit('room_joined')

    if (io.sockets.adapter.rooms.get(roomId).size === 2) {
      const randomProperties = assignRandomProperties()
      socket.emit('start_game', randomProperties[0])
      socket.to(roomId).emit('start_game', randomProperties[1])
    }
  }
}
