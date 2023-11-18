import { Module } from '@nestjs/common'
import { RoomService } from './room.service'
import { RoomGateway } from './room.gateway'
import { GameGateway } from './game.gateway'

@Module({
  providers: [RoomGateway, GameGateway, RoomService]
})
export class RoomModule {}
