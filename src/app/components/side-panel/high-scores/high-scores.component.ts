import { Component, ElementRef, OnDestroy, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HighScoreModel } from 'src/app/models/highscore-model';
import { MessageModel } from 'src/app/models/message-model';

import { ModalService } from 'src/app/modules/modal';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  private readonly _storageKey = 'b3dingb3dang';

  public highScoreList: HighScoreModel[] = [];
  public userName = '';

  @ViewChild('nameinput') nameInput: ElementRef;

  constructor(
    private gameService: GameService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.gameService.message$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.messageHandler);
    this.highScoreList = this.loadHighScoreFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // event handlers

  public messageHandler = (msg: MessageModel): void => {
    if (msg.isEndGame) {
      if (this.isHighScore()) {
        this.openModal();
        this.gameService.playSound("success");
      }
    }
  }

  public closeModal(id: string, saveScore: boolean): void {
    if (saveScore) {
      if (this.userName.trim().length > 0) {
        this.addScore();
        this.saveHighScoreInLocalStorage();
      }
    }

    this.modalService.close(id);
  }

  // private functions

  private openModal(): void {
    this.modalService.open('jw-modal-hs');
    this.nameInput.nativeElement.focus();
  }

  private isHighScore(): boolean {
    if (this.highScoreList.length < this.gameService.maxHighScore || this.scoreQualify()) {
      return true;
    }

    return false;
  }

  private scoreQualify(): boolean {
    const score = this.gameService.getValue('score');
    return (this.highScoreList.filter(x => x.score < score).length > 0);
  }

  private loadHighScoreFromLocalStorage(): HighScoreModel[] {
    let rv: HighScoreModel[] = [];
    const json = window.localStorage.getItem(this._storageKey);
    if (json) {
      rv = (JSON.parse(json) as HighScoreModel[]).sort((a: HighScoreModel, b: HighScoreModel) => {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
      });
    }
    return rv;
  }

  private saveHighScoreInLocalStorage(): void {
    const json = JSON.stringify(this.highScoreList);
    window.localStorage.setItem(this._storageKey, json);
  }

  private addScore(): void {
    const hs: HighScoreModel = {
      name: this.userName,
      date: new Date(),
      elapsed: this.gameService.getValue('elapsed'),
      lines: this.gameService.getValue('lines'),
      score:  this.gameService.getValue('score'),
    };

    this.highScoreList.push(hs);

    this.highScoreList = this.highScoreList.sort((a: HighScoreModel, b: HighScoreModel) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });

    if (this.highScoreList.length > this.gameService.maxHighScore) {
      this.highScoreList.splice(this.gameService.maxHighScore, 1);
    }
  }

}
