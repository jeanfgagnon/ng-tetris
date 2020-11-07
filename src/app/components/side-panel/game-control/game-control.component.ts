import { ChangeDetectionStrategy } from '@angular/core';
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
  public notification = '';

  @ViewChild('btnnew') btnNew: ElementRef;
  @ViewChild('btnpause') btnPause: ElementRef;

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.gameService.message$.subscribe(this.messageHandler);

    this.gameService.currentGameState$.subscribe((gs: GameState) => {
      if (this.gameService.currentGameState === GameState.stopped) {
        this.btnNewText = 'New';
      }
      else if (this.gameService.currentGameState === GameState.started) {
        this.btnPauseText = 'Pause';
      }
      else {
        this.btnPauseText = 'Resume';
      }
    });
  }

  // event handlers

  public messageHandler = (msg: string): void => {
    this.notification = msg;
    setTimeout(() => { this.notification = ''; }, 5000);
  }

  public newGameClick(): void {
    this.notification = '';
    this.btnNew.nativeElement.blur();
    if (this.gameService.currentGameState === GameState.stopped) {
      this.btnNewText = 'Stop';
      this.gameService.setGameState(GameState.started);
    }
    else {
      this.btnNewText = 'New';
      this.gameService.setGameState(GameState.stopped);
    }
  }

  public pauseGameClick(): void {
    this.btnPause.nativeElement.blur();
    if (this.gameService.currentGameState === GameState.started) {
      this.btnPauseText = 'Resume';
      this.gameService.setGameState(GameState.pausing);
    }
    else {
      this.btnPauseText = 'Pause';
      this.gameService.setGameState(GameState.started);
    }
  }

  // helpers

  public getMessage(): string {
    return this.notification;
  }

  public get isGameRunning(): boolean {
    const rv = this.gameService.currentGameState === GameState.started ||
               this.gameService.currentGameState === GameState.pausing;
    return rv;
  }

  public get isGamePaused(): boolean {
    const rv = this.gameService.currentGameState === GameState.pausing;
    return rv;
  }
}
