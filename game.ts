import { random } from './random';

enum DoorType {
  WINNING = 'winning',
  LOOSING = 'loosing',
}

export enum GameResult {
  WIN = 'win',
  LOSE = 'lose',
}

interface Door {
  number: number,
  type: DoorType,
  closed: boolean,
}

export class Game {
  private doors: Door[] = [
    { number: 1, type: DoorType.LOOSING, closed: true },
    { number: 2, type: DoorType.LOOSING, closed: true },
    { number: 3, type: DoorType.LOOSING, closed: true },
  ];

  private _playerSelectedDoors?: number;
  private _hostSelectedDoors?: number;

  get playerSelectedDoors() {
    return this._playerSelectedDoors
  }

  get hostSelectedDoors() {
    return this._hostSelectedDoors
  }

  constructor() {
    this.doors[random(1, 3) - 1].type = DoorType.WINNING;
  }

  get doorsStatus(): string {
    return this.doors.map(door => {
      if (door.closed) return '🚪';
      if (door.type === DoorType.WINNING) return '💰';
      else return '🐐';
    }).join(' ');
  }

  private actionGuard() {
    if (this._playerSelectedDoors === undefined) throw new Error('Player has not selected a door');
    if (this.hostSelectedDoors === undefined) throw new Error('Host has not selected a door');
  }

  playerSelect(doorNumber: number): void {
    if (doorNumber <= 0 || doorNumber > this.doors.length) {
      throw new Error(`Door number must be between ${1} and ${this.doors.length}, received: ${doorNumber}`);
    }

    this._playerSelectedDoors = doorNumber;
  }

  hostSelect(): void {
    const notSelectedDoors = this.doors.filter(({ number }) => number !== this._playerSelectedDoors);
    const firstLoosingDoors = notSelectedDoors.find(({ type }) => type === DoorType.LOOSING) as Door;

    firstLoosingDoors.closed = false;
    this._hostSelectedDoors = firstLoosingDoors.number;
  }

  switch(): void {
    this.actionGuard();

    const switchTo = this.doors.find(({ closed, number }) => closed && this._playerSelectedDoors !== number) as Door;

    this._playerSelectedDoors = switchTo.number;
  }

  finish(): GameResult {
    this.actionGuard();

    this.doors.forEach(door => door.closed = false);

    const selectedDoors = this.doors.find(({ number }) => number === this._playerSelectedDoors) as Door;

    return selectedDoors.type === DoorType.WINNING ? GameResult.WIN : GameResult.LOSE;
  }
}