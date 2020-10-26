import { CartesianCoords } from './cartesian-coords';

export class TileModel {
  isBorder: boolean;
  bgColor: string;
  size: number;
  free: boolean;
  coords: CartesianCoords;
}