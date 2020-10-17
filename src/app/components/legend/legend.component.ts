import { Component, OnInit } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  // helpers

  public get Width(): number {
    return this.gameService.boardWidth;
  }
}
