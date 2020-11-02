import { CartesianCoords } from './cartesian-coords';

export class TileModel {
  isBorder: boolean;
  corner: number;
  bgColor: string;
  size: number;
  free: boolean;
  coords: CartesianCoords;
}