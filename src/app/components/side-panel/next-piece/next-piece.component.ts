import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CardinalPoint } from 'src/app/common/cardinal-points-enum';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-next-piece',
  templateUrl: './next-piece.component.html',
  styleUrls: ['./next-piece.component.scss']
})
export class NextPieceComponent implements OnInit {

  public tetrominoHtml: SafeHtml = '';
  constructor(
    private gameService: GameService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.gameService.nextTetromino$.subscribe((tt: string) => {
      const tetrominoInfo = this.gameService.generateTetromino(tt, CardinalPoint.north, 10);
      this.tetrominoHtml = this.sanitizer.bypassSecurityTrustHtml(tetrominoInfo.html);
    });
  }

}
