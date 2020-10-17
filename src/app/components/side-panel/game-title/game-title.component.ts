import { Component, OnInit } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss']
})
export class GameTitleComponent implements OnInit {

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // helpers

  public get GameName(): string {
    return this.gameService.name;
  }

  public get GameVersion(): string {
    return this.gameService.version;
  }

}
