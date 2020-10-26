//import { AfterMoveCallback } from 'src/app/models/any-move-info';
import { style, animate, keyframes, AnimationStyleMetadata, AnimationBuilder } from '@angular/animations';
import { ElementRef } from '@angular/core';

import { AfterMoveCallback, AnyMoveInfo } from '../models/any-move-info';
import { CardinalPoint } from './cardinal-points-enum';

export class AnyMoveProcessor {
  private moveInfo: AnyMoveInfo;
  private afterMoveCallback: AfterMoveCallback;

  // C'TORs

  public constructor(callback: AfterMoveCallback | null) {
    this.afterMoveCallback = callback;
  }

  // publics

  public move(mi: AnyMoveInfo) {
    this.moveInfo = mi;
    this.calcFutureCoords();
    this.animate();
  }

  // privates

  private animate(): void {
    const tileAnimationStyleMetadata = this.getMetadata();

    const animFactory = this.moveInfo.animationBuilder.build([
      style({
        left: `${this.moveInfo.coords.x}px`,
        top: `${this.moveInfo.coords.y}px`
      }),
      animate(this.moveInfo.duration, keyframes(tileAnimationStyleMetadata))
    ]);

    const player = animFactory.create(this.moveInfo.element.nativeElement);

    player.onDone(() => {
      if (this.afterMoveCallback && typeof this.afterMoveCallback === 'function') {
        this.afterMoveCallback(this.moveInfo);
      }
      player.destroy();
    });

    player.play();
  }

  private getMetadata(): AnimationStyleMetadata[] {

    let meta: AnimationStyleMetadata[];

    meta = [
      style({
        left: `${this.moveInfo.coords.x}px`,
        top: `${this.moveInfo.coords.y}px`
      }),
      style({
        left: `${this.moveInfo.futureCoords.x}px`,
        top: `${this.moveInfo.futureCoords.y}px`
      })
    ];

    return meta;
  }

  private calcFutureCoords(): void {
    switch (this.moveInfo.direction) {
      case CardinalPoint.north:
        this.moveInfo.futureCoords.y = this.moveInfo.coords.y - this.moveInfo.distance;
        this.moveInfo.futureCoords.x = this.moveInfo.coords.x;
        break;

      case CardinalPoint.east:
        this.moveInfo.futureCoords.x = this.moveInfo.coords.x + this.moveInfo.distance;
        this.moveInfo.futureCoords.y = this.moveInfo.coords.y;
        break;

      case CardinalPoint.south:
        this.moveInfo.futureCoords.y = this.moveInfo.coords.y + this.moveInfo.distance;
        this.moveInfo.futureCoords.x = this.moveInfo.coords.x;
        break;

      case CardinalPoint.west:
        this.moveInfo.futureCoords.x = this.moveInfo.coords.x - this.moveInfo.distance;
        this.moveInfo.futureCoords.y = this.moveInfo.coords.y;
        break;
    }
  }
}