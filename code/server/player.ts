export type Position = {
  X: number;
  Y: number;
};
export default class Player {
  id: string;
  position: Position;

  constructor(id: string) {
    this.id = id;
    this.position = { X: 0, Y: 0 };
  }

  getPosition(): Position {
    return this.position;
  }

  moveTo(pos: Position) {
    this.position = pos;
  }
}
