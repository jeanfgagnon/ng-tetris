import { Component, Input, OnInit } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-display-value',
  templateUrl: './display-value.component.html',
  styleUrls: ['./display-value.component.scss']
})
export class DisplayValueComponent implements OnInit {

  private _label = 'x';
  private _varName = '';

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // helpers

  public get Value(): string {
    let v = this.gameService.getValue(this.VarName);
    return v.toString();
  }

  // properties

  @Input() public set Label(text: string) {
    this._label = text;
  }
  public get Label(): string {
    return this._label;
  }

  @Input() public set VarName(name: string) {
    this._varName = name;
  }
  public get VarName(): string {
    return this._varName;
  }
}
