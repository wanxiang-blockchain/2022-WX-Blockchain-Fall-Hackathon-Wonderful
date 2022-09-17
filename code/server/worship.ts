import Player from './player';
import { Position } from './player';
import WebSocket from 'ws';
export default class Worship {
  id: string;
  players: Map<Player, WebSocket>;

  constructor(id: string) {
    this.players = new Map<Player, WebSocket>();
    this.id = id;
  }

  join(playerId: string, ws: WebSocket): Player[] {
    let players: Player[] = [];
    let player = global.playerMgr.getPlayerById(playerId);
    if (this.players.has(player)) {
      throw Error('Already join');
    }
    this.players.set(player, ws);
    for (var key of this.players.keys()) {
      players.push(key);
    }
    return players;
  }

  moveTo(playerId: string, pos: Position) {
    let player = global.playerMgr.getPlayerById(playerId);
    player.moveTo(pos);
  }

  quit(player: Player) {
    this.players.delete(player);
  }
}
