import { CardinalPoints } from './cardinal-points-enum';

export class TetrominoBuilder {

  private tetrominoType: string;
  private cardinalPoint: CardinalPoints;
  private cellSize: number;
  private matrice: Array<boolean[]>;

  constructor(tt: string, cp: CardinalPoints, cs: number) {
    this.tetrominoType = tt;
    this.cardinalPoint = cp;
    this.cellSize = cs;
  }

  public getHtml(): string {
    this.setMatrice();
    const { styleWidth, styleHeight } = this.getStyleWH();

    let html = `<div style="position: relative; width: ${styleWidth}px; height: ${styleHeight}px">`;
    html += this.placeCube();
    html += "</div>";

    return html
  }

  // privates

  private placeCube(): string {
    let html = '';
    const cube = `<div style="width: ${this.cellSize}px; height: ${this.cellSize}px; position: absolute; top: YYYpx; left: XXXpx; background-color: ${this.bgColor()};"></div>`;
    for (let y = 0; y < this.matrice.length; y++) {
      for (let x = 0; x < this.matrice[y].length; x++) {
        if (this.matrice[y][x]) {
          html += cube.replace(/YYY/g, (y * this.cellSize).toString()).replace(/XXX/g, (x * this.cellSize).toString());
        }
      }
    }

    return html;
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

  private setMatrice(): void {
    this.matrice = [];
    let row: boolean[];
    switch (this.tetrominoType) {
      case 'I':
        if (this.cardinalPoint === CardinalPoints.north || this.cardinalPoint === CardinalPoints.south) {
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
          case CardinalPoints.north:
            row = [false, true, false];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [false, true, false];
            this.matrice.push(row);
            break;

          case CardinalPoints.east:
            row = [false, true];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.west:
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
          case CardinalPoints.south:
          case CardinalPoints.north:
            row = [false, true, true];
            this.matrice.push(row);
            row = [true, true, false];
            this.matrice.push(row);
            break;

          case CardinalPoints.west:
          case CardinalPoints.east:
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
          case CardinalPoints.south:
          case CardinalPoints.north:
            row = [true, true, false];
            this.matrice.push(row);
            row = [false, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.west:
          case CardinalPoints.east:
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
          case CardinalPoints.north:
            row = [true, false, false];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [false, false, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.east:
            row = [false, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            row = [true, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.west:
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
          case CardinalPoints.north:
            row = [false, false, true];
            this.matrice.push(row);
            row = [true, true, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.south:
            row = [true, true, true];
            this.matrice.push(row);
            row = [true, false, false];
            this.matrice.push(row);
            break;

          case CardinalPoints.east:
            row = [true, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            row = [false, true];
            this.matrice.push(row);
            break;

          case CardinalPoints.west:
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
        if (this.cardinalPoint === CardinalPoints.north || this.cardinalPoint === CardinalPoints.south) {
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
        if (this.cardinalPoint === CardinalPoints.north || this.cardinalPoint === CardinalPoints.south) {
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
