import Player from './player';

export default class PlayerMgr {
  private static instance: PlayerMgr;
  players: Map<string, Player>;

  constructor() {
    this.players = new Map<string, Player>();
  }

  static getInstance(): PlayerMgr {
    return this.instance;
  }

  getPlayerById(id: string): Player {
    if (this.players.has(id)) {
      return this.players.get(id);
    } else {
      let player = new Player(id);
      this.players.set(id, player);
      return player;
    }
  }
}
