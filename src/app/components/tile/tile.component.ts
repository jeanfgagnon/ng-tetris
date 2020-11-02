import { Component, Input, OnInit } from '@angular/core';
import { TileModel } from 'src/app/models/tile-model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  private _model: TileModel;

  constructor() { }

  ngOnInit(): void {
  }

  // properties

  @Input() public set Model(tileModel: TileModel) {
    this._model = tileModel;
  }
  public get Model(): TileModel {
    return this._model;
  }

  public get tileStyle(): Object {
    let style: Object = {
      position: 'absolute',
      top: `${this.Model.coords.y}px`,
      left: `${this.Model.coords.x}px`,
      width: `${this.Model.size}px`,
      height: `${this.Model.size}px`,
      boxShadow: 'inset 0 -1px 2px rgba(255,255,255,0.8), inset 0 1px 2px rgba(255,255,255,0.8)'
    };

    if (this.Model.corner !== 0) {
      //12
      //34
      switch (this.Model.corner) {
        case 1:
          Object.assign(style, {
            borderTopLeftRadius: '9px'
          });
          break;
        case 2:
          Object.assign(style, {
            borderTopRightRadius: '9px'
          });
          break;
        case 3:
          Object.assign(style, {
            borderBottomLeftRadius: '9px'
          });
          break;
        case 4:
          Object.assign(style, {
            borderBottomRightRadius: '9px'
          });
          break;
      }
    }
    if (this.Model.isBorder) {
      Object.assign(style, {
        backgroundColor: 'black',
      });
    }
    else {
      Object.assign(style, {
        backgroundColor: `${this.Model.bgColor}`
      });
    }

    return style;
  }
}
