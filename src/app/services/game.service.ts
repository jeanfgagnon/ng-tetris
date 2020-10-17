import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { CardinalPoints } from '../common/cardinal-points-enum';
import { TetrominoBuilder } from '../common/tetromino-builder';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private validKeys: string[] = [];
  private keypressSubject = new Subject<KeyboardEvent>();
  private nextTetrominoSubject = new Subject<string>();

  private tetrominosType: string[] = [];
  private nextTetrominoType = '';
  private multiValue = new Map<string, number>();

  // tétriste lol
  public readonly name = 'Tétriste';
  public readonly version = '1.0a';

  public readonly cellSize = 30;
  public readonly boardRows = 24;
  public readonly boardCols = 10;

  public keypress$: Observable<KeyboardEvent>;
  public nextTetromino$: Observable<string>;

  constructor(
  ) {
    window.addEventListener('keydown', this.keypressHandler);

    this.keypress$ = this.keypressSubject.asObservable();
    this.nextTetromino$ = this.nextTetrominoSubject.asObservable();

    this.multiValue.set('elapsed', 69);
    this.multiValue.set('score', 0);
    this.multiValue.set('lines', 0);

    this.tetrominosType = this.getTetreominosType();
  }

  public get boardHeight(): number {
    return this.cellSize * (this.boardRows + 2);
  }

  public get boardWidth(): number {
    return this.cellSize * (this.boardCols + 2);
  }

  public keypressHandler = (event: KeyboardEvent) => {
    if (this.validKeys.indexOf(event.key) > -1) {
      this.keypressSubject.next(event);
    }
  };

  public dispose(): void {
    window.removeEventListener('keydown', this.keypressHandler);
  }

  public acceptKeypress(keys: string[]): void {
    this.validKeys = keys;
  }

  public getValue(name: string): number {
    let rv = 0;
    if (this.multiValue.has(name)) {
      rv = this.multiValue.get(name);
    }

    return rv;
  }

  // genère le html d'un tétromino.
  public generateTetromino(tetrominoType: string, cp: CardinalPoints, cellSize: number) {
    const tetrominoBuilder = new TetrominoBuilder(tetrominoType, cp, cellSize);

    return tetrominoBuilder.getHtml();
  }

  // get un tetrominoType au hasard et le swing dans le sujet
  public nextTetromino(): void {
    this.nextTetrominoType = this.tetrominosType[Math.floor(Math.random() * this.tetrominosType.length)];
    console.log(this.nextTetrominoType);
    this.nextTetrominoSubject.next(this.nextTetrominoType);
  }

  // privates

  private getTetreominosType(): string[] {
    return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  }
}
