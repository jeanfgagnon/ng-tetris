import { TetrominoInfo } from '../models/tetromino-info';
import { CardinalPoint } from './cardinal-points-enum';

export class TetrominoBuilder {

  private tetrominoType: string;
  private cardinalPoint: CardinalPoint;
  private cellSize: number;
  private showBorder = false;

  private matrice: Array<boolean[]>;

  constructor(tt: string, cp: CardinalPoint, cs: number, sb: boolean) {
    this.tetrominoType = tt;
    this.cardinalPoint = cp;
    this.cellSize = cs;
    this.showBorder = sb;
  }


  public tetrominoInfo(): TetrominoInfo {
    const { styleWidth, styleHeight } = this.getStyleWH();
    this.createMatrice();
    return {
      html: this.getHtml(styleWidth, styleHeight),
      width: styleWidth,
      height: styleHeight,
      bgColor: this.bgColor(),
      matrice: this.matrice
    };
  }

  // privates

  private getHtml(styleWidth: number, styleHeight: number): string {

    let html = `<div style="position: relative; width: ${styleWidth}px; height: ${styleHeight}px">`;
    html += this.placeCube();
    html += "</div>";

    return html
  }

  private placeCube(): string {
    let html = '';
    const cube = `<div style="SSSwidth: ${this.cellSize}px; height: ${this.cellSize}px; position: absolute; top: YYYpx; left: XXXpx; background-color: ${this.bgColor()};"></div>`;

    for (let y = 0; y < this.matrice.length; y++) {
      for (let x = 0; x < this.matrice[y].length; x++) {
        if (this.matrice[y][x]) {
          html += cube.replace(/YYY/g, (y * this.cellSize).toString())
            .replace(/XXX/g, (x * this.cellSize).toString())
            .replace(/SSS/g, this.getBorderStyle());
        }
      }
    }

    return html;
  }

  private getBorderStyle() {
    let rv = '';
    if (this.showBorder) {
      rv = "box-shadow: rgba(255, 255, 255, 0.8) 0px -1px 2px inset, rgba(255, 255, 255, 0.8) 0px 1px 2px inset;"
    }

    return rv;
  }

  private bgColor(): string {
    let rv = '';
    switch (this.tetrominoType) {
      case 'I':
        rv = 'lightblue';
        break;

      case 'O':
        rv = 'Yellow';
        break;

      case 'T':
        rv = 'Purple';
        break;

      case 'S':
        rv = 'Green';
        break;

      case 'Z':
        rv = 'Red';
        break;

      case 'J':
        rv = 'Blue';
        break;

      case 'L':
        rv = 'Orange';
        break;
    }

    return rv;
  }

  private createMatrice(): void {
    this.matrice = [];
    let row: boolean[];
    switch (this.tetrominoType) {
      case 'I':
        if (this.cardinalPoint === CardinalPoint.north || this.cardinalPoint === CardinalPoint.south) {
          row = [true, true, true, true];
          this.matrice.push(row);
        }
        else {
          for (let i = 0; i < 4; i++) {
            row = [true];
            this.matrice.push(row);
          }
        }
        break;

      case 'O':
        for (let i = 0; i < 2; i++) {
          row = [true, true];
          this.matrice.push(row);
        }
        break;

      case 'T':
        switch (this.cardinalPoint) {
          case CardinalPoint.north:
            row = [false, true, false];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [false, true, false];
            this.matrice.push(row);
            break;

          case CardinalPoint.east:
            row = [false, true];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.west:
            row = [true, false];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            row = [true, false];
            this.matrice.push(row);
            break;
        }
        break;

      case 'S':
        switch (this.cardinalPoint) {
          case CardinalPoint.south:
          case CardinalPoint.north:
            row = [false, true, true];
            this.matrice.push(row);
            row = [true, true, false];
            this.matrice.push(row);
            break;

          case CardinalPoint.west:
          case CardinalPoint.east:
            row = [true, false];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            break;
        }
        break;

      case 'Z':
        switch (this.cardinalPoint) {
          case CardinalPoint.south:
          case CardinalPoint.north:
            row = [true, true, false];
            this.matrice.push(row);
            row = [false, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.west:
          case CardinalPoint.east:
            row = [false, true];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            row = [true, false];
            this.matrice.push(row);
            break;
        }
        break;

      case 'J':
        switch (this.cardinalPoint) {
          case CardinalPoint.north:
            row = [true, false, false];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [false, false, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.east:
            row = [false, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.west:
            row = [true, true];
            this.matrice.push(row);
            row = [true, false];
            this.matrice.push(row);
            row = [true, false];
            this.matrice.push(row);
            break;
        }
        break;

      case 'L':
        switch (this.cardinalPoint) {
          case CardinalPoint.north:
            row = [false, false, true];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [true, false, false];
            this.matrice.push(row);
            break;

          case CardinalPoint.east:
            row = [true, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            break;

          case CardinalPoint.west:
            row = [true, false];
            this.matrice.push(row);
            row = [true, false];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            break;
        }
        break;
    }
  }
  //    return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  private getStyleWH(): any {
    let w = 0, h = 0; // en nb cell

    switch (this.tetrominoType) {
      case 'I':
        if (this.cardinalPoint === CardinalPoint.north || this.cardinalPoint === CardinalPoint.south) {
          w = 4;
          h = 1;
        }
        else {
          w = 1;
          h = 4;
        }
        break;

      case 'O':
        w = 2;
        h = 2;
        break;

      default:
        if (this.cardinalPoint === CardinalPoint.north || this.cardinalPoint === CardinalPoint.south) {
          w = 3;
          h = 2;
        }
        else {
          w = 2;
          h = 3;
        }
        break;
    }

    return {
      styleWidth: w * this.cellSize,
      styleHeight: h * this.cellSize
    };
  }
}
