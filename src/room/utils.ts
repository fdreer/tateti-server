import { Socket } from 'socket.io'
import { Turn } from 'src/consts'

// Cada vez que un socket se conecta al servidor, se crea una sala con su client.id
/**
 * Filtra todas las salas en la que esta el cliente, menos en la sala por defecto que tiene su mismo "id"
 */
export const getRoomsFromSocket = (socket: Socket) => {
  return Array.from(socket.rooms.values()).filter((room) => room !== socket.id)
}

export const assignRandomProperties = () => {
  // Genera un booleano aleatorio
  const isMyTurn = Math.random() < 0.5

  // Genera un símbolo aleatorio 'x' o 'o'
  const symbol = Math.random() < 0.5 ? Turn.X : Turn.O

  // Retorna el objeto con las propiedades asignadass
  return [
    { isMyTurn, symbol },
    { isMyTurn: !isMyTurn, symbol: symbol === Turn.X ? Turn.O : Turn.X }
  ]
}
