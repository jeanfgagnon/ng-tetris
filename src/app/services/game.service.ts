import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { CardinalPoint } from '../common/cardinal-points-enum';
import { GameState } from '../common/game-state-enum';
import { TetrominoBuilder } from '../common/tetromino-builder';
import { TetrominoInfo } from '../models/tetromino-info';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private validKeys: string[] = [];
  private keypressSubject = new Subject<KeyboardEvent>();
  private nextTetrominoSubject = new Subject<string>();
  private currentTetrominoSubject = new Subject<string>();
  private currentGameStateSubject = new BehaviorSubject<GameState>(GameState.stopped);

  private nextTetrominoType = '';
  private currentTetrominoType: string;
  private multiValue = new Map<string, number>();

  private readonly minInterval = 200;

  // tétriste lol
  public readonly name = 'Tetris';
  public readonly version = '0.1a';

  public readonly cellSize = 30;
  public readonly boardRows = 24;
  public readonly boardCols = 10;
  public readonly fieldBgColor = '#888888';

  public running = false;
  public intervalle = 500;
  public timerHandle: any = null;

  public nextTetromino$: Observable<string>;
  public currentTetromino$: Observable<string>;
  public currentGameState$: Observable<GameState>;

  constructor(
  ) {
    this.nextTetromino$ = this.nextTetrominoSubject.asObservable();
    this.currentTetromino$ = this.currentTetrominoSubject.asObservable();
    this.currentGameState$ = this.currentGameStateSubject.asObservable();

    this.multiValue.set('elapsed', 69);
    this.multiValue.set('score', 0);
    this.multiValue.set('lines', 0);
  }

  public setGameState(gs: GameState) : void {
    this.currentGameStateSubject.next(gs);
  }

  public dispose(): void {
  }

  public getCurrentTetrominoType(): string {
    return this.currentTetrominoType;
  }

  public getValue(name: string): number {
    let rv = 0;
    if (this.multiValue.has(name)) {
      rv = this.multiValue.get(name);
    }

    return rv;
  }

  // génère le html d'un tétromino.
  public generateTetromino(tetrominoType: string, cp: CardinalPoint, cellSize: number, showBorder: boolean = false): TetrominoInfo {
    const tetrominoBuilder = new TetrominoBuilder(tetrominoType, cp, cellSize, showBorder);
    return  tetrominoBuilder.tetrominoInfo();
  }

  // get un tetrominoType au hasard et le swing dans le sujet
  public nextTetromino(): void {
    if (this.nextTetrominoType) {
      this.currentTetrominoType = this.nextTetrominoType;
    }
    else {
      this.currentTetrominoType = this.getRandomTetromino();
    }
    this.currentTetrominoSubject.next(this.currentTetrominoType);
    this.nextTetrominoType = this.getRandomTetromino();
    this.nextTetrominoSubject.next(this.nextTetrominoType);
  }

  public gameState(gs: GameState): void {
    this.currentGameStateSubject.next(gs);
  }

  // privates

  private getRandomTetromino(): string {
    const tetrominosType = this.getTetreominosType();
    const rv = tetrominosType[Math.floor(Math.random() * tetrominosType.length)];

    return rv;
  }

  private getTetreominosType(): string[] {
    return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  }

  // properties

  public get currentGameState(): GameState {
    const value = this.currentGameStateSubject.getValue();
    return value;
  }

  public get boardHeight(): number {
    return this.cellSize * (this.boardRows + 2);
  }

  public get boardWidth(): number {
    return this.cellSize * (this.boardCols + 2);
  }

}
