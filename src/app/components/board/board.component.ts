import { Component, OnInit } from '@angular/core';

import { TileModel } from 'src/app/models/tile-model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // helpers

  public getBorderTile(side: string): TileModel[] {
    const tms: TileModel[] = [];

    if (side === 'top') {
      for (let i = 1; i < this.gameService.boardCols + 1; i++) {
        const tile: TileModel = {
          isBorder: true,
          bgColor: '',
          size: this.gameService.cellSize,
          free: false,
          coords: {
            x: i * this.gameService.cellSize,
            y: 0
          }
        };
        tms.push(tile);
      }
    }
    else if (side === 'bottom') {
      for (let i = 1; i < this.gameService.boardCols + 1; i++) {
        const tile: TileModel = {
          isBorder: true,
          bgColor: '',
          size: this.gameService.cellSize,
          free: false,
          coords: {
            x: i * this.gameService.cellSize,
            y: this.gameService.cellSize * (this.gameService.boardRows + 1)
          }
        };
        tms.push(tile);
      }
    }
    else if (side === 'left') {
      for (let i = 0; i < this.gameService.boardRows + 2; i++) {
        const tile: TileModel = {
          isBorder: true,
          bgColor: '',
          size: this.gameService.cellSize,
          free: false,
          coords: {
            x: 0,
            y: i * this.gameService.cellSize
          }
        };
        tms.push(tile);
      }
    }
    else if (side === 'right') {
      for (let i = 0; i < this.gameService.boardRows + 2; i++) {
        const tile: TileModel = {
          isBorder: true,
          bgColor: '',
          size: this.gameService.cellSize,
          free: false,
          coords: {
            x: this.gameService.cellSize * (this.gameService.boardCols + 1),
            y: i * this.gameService.cellSize
          }
        };
        tms.push(tile);
      }
    }

    return tms;
  }

  public getTileNo(y: number): string {
    return ((y / this.gameService.cellSize) - 1).toString();
  }

  // properties

  public get getDynaStyle(): Object {
    return {
      backgroundColor: '#444444',
      position: 'relative',
      height: `${this.gameService.boardHeight}px`,
      width: `${this.gameService.boardWidth}px`,
    };
  }
}
