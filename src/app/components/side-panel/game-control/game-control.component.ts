import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss']
})
export class GameControlComponent implements OnInit {

  @ViewChild("btnnew") btnNew: ElementRef;
  @ViewChild("btnpause") btnPause: ElementRef;

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // event handlers

  public newGameClick(e: Event): void {
    this.btnNew.nativeElement.blur();
    this.gameService.nextTetromino();
  }
}
