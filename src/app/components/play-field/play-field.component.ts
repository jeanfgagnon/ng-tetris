import { AnimationBuilder } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { takeWhile } from "rxjs/operators";

import { AnyMoveProcessor } from 'src/app/common/any-move-processor';
import { AnyMoveInfo } from 'src/app/models/any-move-info';
import { CardinalPoints } from 'src/app/common/cardinal-points-enum';
import { CartesianCoords } from 'src/app/models/cartesian-coords';
import { DataQueue } from 'src/app/common/data-queue';
import { GameService } from 'src/app/services/game.service';
import { TileModel } from 'src/app/models/tile-model';
import { GameState } from 'src/app/common/game-state-enum';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.scss']
})
export class PlayFieldComponent implements AfterViewInit, OnInit {
  private pieceCoords: CartesianCoords;
  private readonly fieldHeight = this.gameService.cellSize * (this.gameService.boardRows);
  private readonly fieldWidth = this.gameService.cellSize * (this.gameService.boardCols);
  private cpArray: CardinalPoints[];
  private currentCP = 0;
  private moveProc: AnyMoveProcessor;
  private isAnimating = false;
  private keyQueue = new DataQueue();
  private previousGameState = GameState.stopped;

  public tableau: Array<TileModel[]> = [];
  public tetrominoHtml: SafeHtml = '';

  @ViewChild('piece') private piece: ElementRef;

  constructor(
    private gameService: GameService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private animBuilder: AnimationBuilder
  ) { }

  ngOnInit(): void {
    this.gameService.currentGameState$.subscribe(this.currentGameStateHandler);
    this.gameService.currentTetromino$.subscribe(this.currentTetrominoHandler);
    this.resetPieceCoords();
    this.initCpStuff();
    this.buildTableau();
  }

  public ngAfterViewInit(): void {
    this.moveProc = new AnyMoveProcessor(this.animDoneCallback);
    this.placePiece();
  }

  // Event handlers

  public currentGameStateHandler = (gs: GameState): void => {
    if (gs === GameState.started) {
      if (this.previousGameState === GameState.stopped) {
        this.gameService.nextTetromino();
      }
      this.runGame();
    }
    else if (gs === GameState.pausing) {
      console.log('Game is paused');
    }
    else {
      if (this.previousGameState === GameState.started) {
        this.cleanup();
      }
    }
    this.previousGameState = gs;
  }

  public currentTetrominoHandler = (currentTetrominoType: string): void => {
    this.currentCP = 0;
    this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.gameService.generateTetromino(currentTetrominoType, this.cpArray[this.currentCP], this.gameService.cellSize, true));
  }

  @HostListener('window:keyup', ['$event'])
  public keypressHandler = (e: KeyboardEvent): void => {
    if (!this.isAnimating) {
      switch (e.key) {
        case "ArrowUp":
          this.currentCP++;
          if (this.currentCP > 3) {
            this.currentCP = 0;
          }
          this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.gameService.generateTetromino(this.gameService.getCurrentTetrominoType(), this.cpArray[this.currentCP], this.gameService.cellSize, true));
          break;

        case "ArrowLeft":
          this.pieceCoords.x -= this.gameService.cellSize;
          // const moveInfo = this.getMoveInfo(CardinalPoints.west);
          // this.isAnimating = true;
          // this.moveProc.move(moveInfo);
          this.placePiece();
          break;

        case "ArrowRight":
          this.pieceCoords.x += this.gameService.cellSize;
          // const moveInfo = this.getMoveInfo(CardinalPoints.east);
          // this.isAnimating = true;
          // this.moveProc.move(moveInfo);
          this.placePiece();
          break;
      }
    }
    else {
      this.keyQueue.enqueue(e.key);
      console.log('Key missed: %s', e.key);
    }
    e.preventDefault(); // ツ
    e.stopPropagation();
  }

  public animDoneCallback = (mi: AnyMoveInfo): void => {
    this.pieceCoords.x = mi.futureCoords.x;
    this.pieceCoords.y = mi.futureCoords.y;
    this.placePiece();
    this.isAnimating = false;
  }

  // privates

  // main game loooooooop
  private runGame(): void {
    interval(this.gameService.intervalle).pipe(takeWhile(x => this.gameService.currentGameState === GameState.started)).subscribe(() => {
      console.log('game is running');

      const moveInfo = this.getMoveInfo(CardinalPoints.south);
      this.moveProc.move(moveInfo);

    });
  }

  private getMoveInfo(cp: CardinalPoints): AnyMoveInfo {
    return {
      coords: {
        x: this.pieceCoords.x,
        y: this.pieceCoords.y
      },
      futureCoords: {
        x: this.pieceCoords.x,
        y: this.pieceCoords.y
      },
      direction: cp,
      duration: this.gameService.intervalle - 100,
      distance: this.gameService.cellSize,
      element: this.piece,
      animationBuilder: this.animBuilder
    };
  }

  private buildTableau(): void {
    this.tableau = [];
    for (let row = this.gameService.boardRows - 1; row >= 0; row--) {
      const tileRow = [];
      for (let col = 0; col < this.gameService.boardCols; col++) {
        const tileModel: TileModel = {
          isBorder: false,
          bgColor: '#888888',
          size: this.gameService.cellSize,
          coords: {
            x: col * this.gameService.cellSize,
            y: row * this.gameService.cellSize
          }
        };
        tileRow.push(tileModel);
      }
      this.tableau.push(tileRow);
    }
  }

  private initCpStuff(): void {
    this.cpArray = [];
    this.cpArray.push(CardinalPoints.north);
    this.cpArray.push(CardinalPoints.west);
    this.cpArray.push(CardinalPoints.south);
    this.cpArray.push(CardinalPoints.east);

    this.currentCP = 0;
  }

  // place la pièce (un tétromino quelconque) au bon endroit sur le plan cartésien du field
  private placePiece(): void {
    this.renderer.setStyle(this.piece.nativeElement, 'left', `${this.pieceCoords.x}px`);
    this.renderer.setStyle(this.piece.nativeElement, 'top', `${this.pieceCoords.y}px`);
  }

  private resetPieceCoords(): void {
    this.pieceCoords = {
      x: this.gameService.cellSize * 3,
      y: 0
    };
  }

  private cleanup() {
    console.log('cleanup');
    this.tetrominoHtml = '';
    this.resetPieceCoords();
    this.placePiece();
  }

  // properties

  public get getFieldStyle(): Object {
    return {
      position: 'absolute',
      top: `${this.gameService.cellSize}px`,
      left: `${this.gameService.cellSize}px`,
      height: `${this.fieldHeight}px`,
      width: `${this.fieldWidth}px`,
    };
  }
}
