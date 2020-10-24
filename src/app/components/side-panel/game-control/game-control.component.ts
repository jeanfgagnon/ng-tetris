import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameState } from 'src/app/common/game-state-enum';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss']
})
export class GameControlComponent implements OnInit {

  public btnPauseText = 'Pause';
  public btnNewText = 'New';

  @ViewChild("btnnew") btnNew: ElementRef;
  @ViewChild("btnpause") btnPause: ElementRef;

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // event handlers

  public newGameClick(): void {
    this.btnNew.nativeElement.blur();
    if (this.gameService.currentGameState === GameState.stopped) {
      this.btnNewText = 'Stop';
      this.gameService.gameState(GameState.started);
    }
    else {
      this.btnNewText = 'New';
      this.gameService.gameState(GameState.stopped);
    }
  }

  public pauseGameClick(): void {
    this.btnPause.nativeElement.blur();
    if (this.gameService.currentGameState === GameState.started) {
      this.btnPauseText = 'Resume';
      this.gameService.gameState(GameState.pausing);
    }
    else {
      this.btnPauseText = 'Pause';
      this.gameService.gameState(GameState.started);
    }
  }
}
