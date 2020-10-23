import { Component, OnDestroy, OnInit } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  private validKeypress = [
    " ",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Escape"
  ];

}
