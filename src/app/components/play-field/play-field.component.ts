import { AnimationBuilder } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { takeWhile } from "rxjs/operators";

import { CardinalPoint } from 'src/app/common/cardinal-points-enum';
import { CartesianCoords } from 'src/app/models/cartesian-coords';
import { DataQueue } from 'src/app/common/data-queue';
import { GameService } from 'src/app/services/game.service';
import { TileModel } from 'src/app/models/tile-model';
import { GameState } from 'src/app/common/game-state-enum';
import { TetrominoInfo } from 'src/app/models/tetromino-info';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.scss']
})
export class PlayFieldComponent implements AfterViewInit, OnInit {
  private readonly SPACEBAR = ' ';
  private pieceCoords: CartesianCoords;
  private readonly fieldHeight = this.gameService.cellSize * (this.gameService.boardRows);
  private readonly fieldWidth = this.gameService.cellSize * (this.gameService.boardCols);
  private cpArray: CardinalPoint[];
  private currentCP = 0;
  private keyQueue = new DataQueue();
  private previousGameState = GameState.stopped;
  private tetrominoInfo: TetrominoInfo;

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
    this.resetPiece();
    this.buildTableau();
    this.initCpStuff();
  }

  public ngAfterViewInit(): void {
    this.placePiece();
  }

  // Event handlers

  public currentGameStateHandler = (gs: GameState): void => {
    if (gs === GameState.started) {
      if (this.previousGameState === GameState.stopped) {
        this.buildTableau();
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
    this.tetrominoInfo = this.gameService.generateTetromino(currentTetrominoType, this.cpArray[this.currentCP], this.gameService.cellSize, true)
    this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.tetrominoInfo.html);
  }

  @HostListener('window:keydown', ['$event'])
  public keypressHandler = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      if (this.gameService.currentGameState === GameState.started) {
        this.gameService.gameState(GameState.pausing);
      }
      else {
        this.gameService.gameState(GameState.started);
      }
    }
    else {
      if (this.gameService.currentGameState === GameState.started) {
        switch (e.key) {
          case this.SPACEBAR: // drop
            while (this.pieceCanMove(CardinalPoint.south)) {
              this.pieceCoords.y += this.gameService.cellSize;
            }
            this.placePiece();
            break;

          case "ArrowDown": // speed up
            if (this.pieceCanMove(CardinalPoint.south)) {
              this.pieceCoords.y += this.gameService.cellSize;
              this.placePiece();
            }
            break;

          case "ArrowUp": // rotate
            const previousCurrentCP = this.currentCP;
            this.currentCP++;
            if (this.currentCP > 3) {
              this.currentCP = 0;
            }

            this.tetrominoInfo = this.gameService.generateTetromino(this.gameService.getCurrentTetrominoType(), this.cpArray[this.currentCP], this.gameService.cellSize, true);

            if (!this.isRotationValid()) {
              this.currentCP = previousCurrentCP;
              this.tetrominoInfo = this.gameService.generateTetromino(this.gameService.getCurrentTetrominoType(), this.cpArray[this.currentCP], this.gameService.cellSize, true);
            }

            if (this.isWallInDirection(CardinalPoint.west)) {
              this.pieceCoords.x = this.fieldWidth - this.tetrominoInfo.width;
              this.placePiece();
            }
            else if (this.isWallInDirection(CardinalPoint.south)) {
              this.pieceCoords.y = this.fieldHeight - this.tetrominoInfo.height;
              this.placePiece();
            }

            this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.tetrominoInfo.html);
            break;

          case "ArrowLeft":
            if (this.pieceCanMove(CardinalPoint.east)) {
              this.pieceCoords.x -= this.gameService.cellSize;
              this.placePiece();
            }
            break;

          case "ArrowRight":
            if (this.pieceCanMove(CardinalPoint.west)) {
              this.pieceCoords.x += this.gameService.cellSize;
              this.placePiece();
            }
            break;
        }
      }
    }
    e.preventDefault(); // ツ
    e.stopPropagation();
  }

  // privates

  private isRotationValid(): boolean {
    let rv = true;
    let myX = this.pieceCoords.x;
    let myY = this.pieceCoords.y;

    if (this.isWallInDirection(CardinalPoint.west)) {
      myX = this.fieldWidth - this.tetrominoInfo.width;
    }
    if (this.isWallInDirection(CardinalPoint.south)) {
      myY = this.fieldHeight - this.tetrominoInfo.height;
    }

    for (let row = 0; row < this.tetrominoInfo.matrice.length; row++) {
      for (let col = 0; col < this.tetrominoInfo.matrice[row].length; col++) {
        if (this.tetrominoInfo.matrice[row][col]) {
          const tile = this.getTableauTile(myX + (col * this.gameService.cellSize), myY + (row * this.gameService.cellSize));
          if (!tile.free) {
            return false;
          }
        }
      }
    }

    return rv;
  }

  // main game loooooooop
  private runGame(): void {
    let busted = false;
    interval(this.gameService.intervalle).pipe(takeWhile(x => !busted && this.gameService.currentGameState === GameState.started)).subscribe(() => {
      //busted = true; // this.fieldOverload(); // dans ces eaux ... set a game a stop et bye
      if (!this.pieceCanMove(CardinalPoint.south)) {
        this.mergePiece();
        //this.gameService.setGameState(GameState.pausing);
        //this.resetPieceCourse();
        this.cleanup();
        this.gameService.nextTetromino();
      }
      else {
        this.moveDown();
      }
    });
  }

  // évalue si la pièce peut aller dans la direction voulue
  private pieceCanMove(cp: CardinalPoint): boolean {
    let canMove = !this.isWallInDirection(cp);
    if (canMove) {
      canMove = this.canMoveInDirection(cp);
    }

    return canMove;
  }

  private canMoveInDirection(cp: CardinalPoint): boolean {
    const cartesianCoords = this.getCoordOfCarreauInDirection(cp);
    for (let i = 0; i < cartesianCoords.length; i++) {
      const tile = this.getTableauNextTile(cp, cartesianCoords[i]);
      if (tile && !tile.free) {
        return false;
      }
    }

    return true;
  }

  private getCoordOfCarreauInDirection(cp: CardinalPoint): CartesianCoords[] {
    const coords: CartesianCoords[] = [];

    switch (cp) {
      case CardinalPoint.north:
        for (let col = 0; col < this.tetrominoInfo.matrice[0].length; col++) {
          for (let row = 0; row < this.tetrominoInfo.matrice.length; row++) {
            if (this.tetrominoInfo.matrice[row][col]) {
              const cc: CartesianCoords = {
                x: this.pieceCoords.x + (col * this.gameService.cellSize),
                y: this.pieceCoords.y + (row * this.gameService.cellSize)
              };
              coords.push(cc);
              break;
            }
          }
        }
        break;

      case CardinalPoint.west:
        for (let row = 0; row < this.tetrominoInfo.matrice.length; row++) {
          for (let col = this.tetrominoInfo.matrice[row].length - 1; col >= 0; col--) {
            if (this.tetrominoInfo.matrice[row][col]) {
              const cc: CartesianCoords = {
                x: this.pieceCoords.x + (col * this.gameService.cellSize),
                y: this.pieceCoords.y + (row * this.gameService.cellSize)
              };
              coords.push(cc);
              break;
            }
          }
        }
        break;

      case CardinalPoint.south:
        for (let col = 0; col < this.tetrominoInfo.matrice[0].length; col++) {
          for (let row = this.tetrominoInfo.matrice.length - 1; row >= 0; row--) {
            if (this.tetrominoInfo.matrice[row][col]) {
              const cc: CartesianCoords = {
                x: this.pieceCoords.x + (col * this.gameService.cellSize),
                y: this.pieceCoords.y + (row * this.gameService.cellSize)
              };
              coords.push(cc);
              break;
            }
          }
        }
        break;

      case CardinalPoint.east:
        for (let row = 0; row < this.tetrominoInfo.matrice.length; row++) {
          for (let col = 0; col < this.tetrominoInfo.matrice[row].length; col++) {
            if (this.tetrominoInfo.matrice[row][col]) {
              const cc: CartesianCoords = {
                x: this.pieceCoords.x + (col * this.gameService.cellSize),
                y: this.pieceCoords.y + (row * this.gameService.cellSize)
              };
              coords.push(cc);
              break;
            }
          }
        }
        break;
    }

    return coords;
  }

  private isWallInDirection(cp: CardinalPoint): boolean {
    let isWall = false;
    switch (cp) {
      case CardinalPoint.south:
        isWall = this.pieceCoords.y + this.tetrominoInfo.height >= this.fieldHeight;
        break;

      case CardinalPoint.east:
        isWall = this.pieceCoords.x === 0;
        break;

      case CardinalPoint.west:
        isWall = this.pieceCoords.x + this.tetrominoInfo.width >= this.fieldWidth;
        break;
    }

    return isWall;
  }

  // ajouter la pièce dans le tableau!!
  private mergePiece(): void {
    this.tetrominoInfo.matrice.forEach((row: boolean[], indexY: number) => {
      row.forEach((state: boolean, indexX: number) => {
        if (state) {
          const monx = this.pieceCoords.x + (indexX * this.gameService.cellSize);
          const mony = this.pieceCoords.y + (indexY * this.gameService.cellSize);
          const tile = this.getTableauTile(monx, mony);
          if (tile) {
            tile.free = false;
            tile.bgColor = this.tetrominoInfo.bgColor;
          }
        }
      });
    });
  }

  // va chercher la tuile à côté de la cc selon la direction
  getTableauNextTile(cp: CardinalPoint, cc: CartesianCoords): TileModel {
    switch (cp) {
      case CardinalPoint.north:
        return this.getTableauTile(cc.x, cc.y - this.gameService.cellSize);

      case CardinalPoint.west:
        return this.getTableauTile(cc.x + this.gameService.cellSize, cc.y);

      case CardinalPoint.south:
        return this.getTableauTile(cc.x, cc.y + this.gameService.cellSize);

      case CardinalPoint.east:
        return this.getTableauTile(cc.x - this.gameService.cellSize, cc.y);
    }
  }

  getTableauTile(tileX: number, tileY: number): TileModel {
    let rv: TileModel = null;

    for (let row = 0; row < this.tableau.length; row++) {
      for (let col = 0; col < this.tableau[row].length; col++) {
        const tile = this.tableau[row][col];
        if (tile.coords.x === tileX && tile.coords.y === tileY) {
          return tile;
        }
      }
    }

    return rv;
  }

  // déplace la pièce d'un cellSize vers le bas
  private moveDown() {
    this.pieceCoords.y += this.gameService.cellSize;
    this.placePiece();
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
          free: true,
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
    this.cpArray.push(CardinalPoint.north);
    this.cpArray.push(CardinalPoint.west);
    this.cpArray.push(CardinalPoint.south);
    this.cpArray.push(CardinalPoint.east);

    this.currentCP = 0;
  }

  // place la pièce (un tétromino quelconque) au bon endroit sur le plan cartésien du field
  private placePiece(): void {
    this.renderer.setStyle(this.piece.nativeElement, 'left', `${this.pieceCoords.x}px`);
    this.renderer.setStyle(this.piece.nativeElement, 'top', `${this.pieceCoords.y}px`);
  }

  // remet la pièce en haut au centre
  private resetPiece(): void {
    this.tetrominoHtml = '';
    this.currentCP = 0;
    this.pieceCoords = {
      x: this.gameService.cellSize * 3,
      y: 0
    };
  }

  private cleanup() {
    this.resetPiece();
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
