import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { CardinalPoint } from '../common/cardinal-points-enum';
import { GameState } from '../common/game-state-enum';
import { TetrominoBuilder } from '../common/tetromino-builder';
import { MessageModel } from '../models/message-model';
import { TetrominoInfo } from '../models/tetromino-info';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private messageSubject = new Subject<MessageModel>();
  private nextTetrominoSubject = new Subject<string>();
  private currentTetrominoSubject = new Subject<string>();
  private currentGameStateSubject = new BehaviorSubject<GameState>(GameState.stopped);

  private nextTetrominoType = '';
  private currentTetrominoType: string;
  private multiValue = new Map<string, number>();

  private readonly linePerLevel = 10;

  private readonly startInterval = 500;

  // tétriste lol
  public readonly name = 'Tetris';
  public readonly version = '0.1a';
  public readonly cellSize = 30;
  public readonly boardRows = 24;
  public readonly boardCols = 10;
  public readonly fieldBgColor = '#888888';
  public readonly maxHighScore = 5;

  public running = false;
  public timerHandle: any = null;

  public message$: Observable<MessageModel>;
  public nextTetromino$: Observable<string>;
  public currentTetromino$: Observable<string>;
  public currentGameState$: Observable<GameState>;

  // game speed control
  public intervalle = this.startInterval;
  public  stepperInverval$: Observable<number>;
  private stepperInvervalSubject = new BehaviorSubject<number>(this.intervalle);

  constructor(
  ) {
    this.message$ = this.messageSubject.asObservable();
    this.nextTetromino$ = this.nextTetrominoSubject.asObservable();
    this.currentTetromino$ = this.currentTetrominoSubject.asObservable();
    this.currentGameState$ = this.currentGameStateSubject.asObservable();
    this.stepperInverval$ = this.stepperInvervalSubject.asObservable();

    this.multiValue.set('elapsed', 0);
    this.multiValue.set('score', 0);
    this.multiValue.set('lines', 0);
  }

  public setGameState(gs: GameState): void {
    this.adjustState(gs);
    this.currentGameStateSubject.next(gs);
  }

  public getCurrentTetrominoType(): string {
    return this.currentTetrominoType;
  }

  public setMessage(m: MessageModel): void {
    this.messageSubject.next(m);
  }

  public adjustLoopDelay(): void {
    const level = this.level();
    const currentIntervalle = this.intervalle;
    if (level <= 8) {
      this.intervalle = this.startInterval - (level * 50);
      if (currentIntervalle !== this.intervalle) {
        this.stepperInvervalSubject.next(this.intervalle);
      }
    }
  }

  public incrementScore(v: number): number {
    this.multiValue.set('score', this.multiValue.get('score') + v);
    return this.multiValue.get('score');
  }

  public incrementScoreByFullLine(nbFullRow: number): number {
    const mult = this.getMultiplicator(nbFullRow);
    return this.incrementScore(mult * (this.level() + 1));
  }

  public level(): number {
    return Math.floor(this.multiValue.get('lines') / this.linePerLevel);
  }

  public setValue(name: string, value: any): void {
    this.multiValue.set(name, value);
  }

  public getValue(name: string): number {
    let rv = 0;
    if (this.multiValue.has(name)) {
      rv = this.multiValue.get(name);
    }

    return rv;
  }

  public playSound(name: string): void {
    const player = new Audio();
    player.src = `/assets/${name}.wav`;
    player.load();
    player.play();
  }

  public reset(): void {
    this.multiValue.set('elapsed', 0);
    this.multiValue.set('lines', 0);
    this.multiValue.set('score', 0);

    this.intervalle = this.startInterval;
    this.stepperInvervalSubject.next(this.intervalle);
    this.nextTetrominoType = '';
  }

  // génère le html d'un tétromino.
  public generateTetromino(tetrominoType: string, cp: CardinalPoint, cellSize: number, showBorder: boolean = false): TetrominoInfo {
    const tetrominoBuilder = new TetrominoBuilder(tetrominoType, cp, cellSize, showBorder);
    return tetrominoBuilder.tetrominoInfo();
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

  // privates

  private getRandomTetromino(): string {
    const tetrominosType = this.getTetreominosType();
    const rv = tetrominosType[Math.floor(Math.random() * tetrominosType.length)];

    return rv;
  }

  private getTetreominosType(): string[] {
    return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  }

  private adjustState(gs: GameState): void {
    if (gs === GameState.stopped) {
      clearInterval(this.timerHandle);
    }
    else if (gs === GameState.pausing) {
      clearInterval(this.timerHandle);
    }
    else if (gs === GameState.started) {
      if (this.currentGameState === GameState.stopped) {
        this.reset();
      }
      this.timerHandle = setInterval(() => this.elapsed(), 1000);
    }
  }

  private elapsed(): void {
    this.multiValue.set('elapsed', this.getValue('elapsed') + 1);
  }

  // source: https://tetris.wiki/Scoring
  private getMultiplicator(nbFullRow: number): number {
    switch (nbFullRow) {
      case 1: return 40;
      case 2: return 100;
      case 3: return 300;
      case 4: return 1200;

      default: return 1;
    }
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
