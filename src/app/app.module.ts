import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { BoardComponent } from './components/board/board.component';
import { LegendComponent } from './components/legend/legend.component';
import { TileComponent } from './components/tile/tile.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { GameTitleComponent } from './components/side-panel/game-title/game-title.component';
import { GameInfoComponent } from './components/side-panel/game-info/game-info.component';
import { GameControlComponent } from './components/side-panel/game-control/game-control.component';
import { HighScoresComponent } from './components/side-panel/high-scores/high-scores.component';
import { DisplayValueComponent } from './components/side-panel/display-value/display-value.component';
import { NextPieceComponent } from './components/side-panel/next-piece/next-piece.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    LegendComponent,
    TileComponent,
    SidePanelComponent,
    GameTitleComponent,
    GameInfoComponent,
    GameControlComponent,
    HighScoresComponent,
    DisplayValueComponent,
    NextPieceComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
