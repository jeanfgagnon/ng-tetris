import { AnimationBuilder } from '@angular/animations';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnyMoveProcessor } from 'src/app/common/any-move-processor';

import { CardinalPoints } from 'src/app/common/cardinal-points-enum';
import { AnyMoveInfo } from 'src/app/models/any-move-info';
import { CartesianCoords } from 'src/app/models/cartesian-coords';
import { TileModel } from 'src/app/models/tile-model';
import { GameService } from 'src/app/services/game.service';

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
    this.gameService.keypress$.subscribe(this.keypressHandler);
    this.gameService.currentTetromino$.subscribe(this.currentTetrominoHandler);
    this.pieceCoords = {
      x: this.gameService.cellSize * 3,
      y: 0
    };
    this.initCpStuff();
    this.buildTableau();
  }

  public ngAfterViewInit(): void {
    this.placePiece();
  }

  // Event handlers

  public currentTetrominoHandler = (currentTetrominoType: string): void => {
    this.currentCP = 0;
    this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.gameService.generateTetromino(currentTetrominoType, this.cpArray[this.currentCP], this.gameService.cellSize, true));
  }

  public keypressHandler = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        this.currentCP++;
        if (this.currentCP > 3) {
          this.currentCP = 0;
        }
        break;

      case "ArrowLeft": {
        const moveInfo = this.getMoveInfo(CardinalPoints.west);
        const moveProc = new AnyMoveProcessor(moveInfo, this.animDoneCallback);
        moveProc.move();
        break;
      }

      case "ArrowRight":
        const moveInfo = this.getMoveInfo(CardinalPoints.east);
        const moveProc = new AnyMoveProcessor(moveInfo, this.animDoneCallback);
        moveProc.move();
        break;
    }
    this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(this.gameService.generateTetromino(this.gameService.getCurrentTetrominoType(), this.cpArray[this.currentCP], this.gameService.cellSize, true));
  }

  public animDoneCallback = (mi: AnyMoveInfo): void => {
    this.pieceCoords.x = mi.futureCoords.x;
    this.pieceCoords.y = mi.futureCoords.y;
    this.placePiece();
  }

  // privates

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
      duration: 300,
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
          bgColor: '#444444',
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
    //this.renderer.setStyle(this.piece.nativeElement, 'left', `${this.gameService.cellSize * 3}px`)
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
