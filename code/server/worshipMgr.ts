import Worship from './worship';
import WebSocket from 'ws';

export default class WorshipMgr {
  private static instance: WorshipMgr;
  worships: Map<string, Worship>;

  constructor() {
    this.worships = new Map<string, Worship>();
  }

  join(groupId: string, playerId: string, ws: WebSocket) {
    if (!this.worships.has(groupId)) {
      let worship = new Worship(groupId);
      this.worships.set(groupId, worship);
    }

    let worship = this.worships.get(groupId)!;
    return worship.join(playerId, ws);
  }

  static getInstance() {
    return this.instance;
  }
}
