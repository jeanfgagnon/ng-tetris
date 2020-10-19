import { AnimationBuilder } from '@angular/animations';
import { ElementRef } from '@angular/core';

import { CardinalPoints } from '../common/cardinal-points-enum';
import { CartesianCoords } from './cartesian-coords';

export type AfterMoveCallback = (n: AnyMoveInfo) => any;

export class AnyMoveInfo {
  public coords: CartesianCoords;
  public futureCoords: CartesianCoords;
  public direction: CardinalPoints;
  public duration: number; // ms
  public distance: number; // px
  public element: ElementRef;
  public animationBuilder: AnimationBuilder;
}