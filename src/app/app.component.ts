import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { lineObject } from './objects.model';
import { ProcessingService } from './services/processing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-toe';
  stateIsBlur$ = new BehaviorSubject(true);
  stateZeroTurn$ = new BehaviorSubject(true);
  statePVPGame$ = new BehaviorSubject(true);
  stateLineIsShow$ = new BehaviorSubject(false);
  stateInfoMessageIsShow$ = new BehaviorSubject(false);
  stateSomeWon$ = new BehaviorSubject(false);
  infoHead = 'Игра крестики-нолики';
  infoMessage = 'Начать Игру';
  currentLine: lineObject | null = null;
  fieldCells = [false, false, false, false, false, false, false, false, false,];

  constructor(
    private processingServise: ProcessingService
  ) {

  }

  makeTurn(index: number) {
    if (this.stateSomeWon$.value || this.fieldCells[index]) {
      return;
    }
    if (this.statePVPGame$.value) {
      this.setCell(index);
      this.checkCombination();
    } else {
      this.setCell(index);
      this.checkCombination();
      if (!this.stateSomeWon$.value && this.fieldCells.includes(false)) {
        setTimeout(() => {
          this.setCross();
          this.checkCombination();
        }, 300);
      }
    }
  };

  setCell(index: number) {
    this.fieldCells[index] = true;
    if (this.stateZeroTurn$.value) {
      this.processingServise.zeroCells.push(index);
    } else {
      this.processingServise.crossCells.push(index);
    }
    this.stateZeroTurn$.next(!this.stateZeroTurn$.value);
  };

  isZero(cellIndex: number) {
    return this.processingServise.zeroCells.includes(cellIndex);
  }

  startGame(isPVP: boolean) {
    this.statePVPGame$.next(isPVP);
    this.resetStates();
    this.resetFields();
    this.showInfo();
  };

  private finishGame(zeroWin = true) {
    this.infoMessage = 'Играть заново';
    if (!zeroWin) {
      this.infoHead = 'Выиграл крестик';
    } else {
      this.infoHead = 'Выиграл нолик';
    }
    this.stateIsBlur$.next(true);
  };

  private isDraw() {
    this.infoMessage = 'Играть заново';
    this.infoHead = 'Ничья';
    this.stateIsBlur$.next(true);
  };

  private drowLine(line: lineObject) {
    this.stateLineIsShow$.next(true);
    this.currentLine = line;
  };

  private resetFields() {
    this.fieldCells = this.fieldCells.map(() => false);
  };

  private resetStates() {
    this.processingServise.zeroCells = [];
    this.processingServise.crossCells = [];
    this.stateZeroTurn$.next(true);
    this.stateIsBlur$.next(false);
    this.stateSomeWon$.next(false);
    this.stateLineIsShow$.next(false);
    this.currentLine = null;
  };

  private showInfo() {
    this.stateInfoMessageIsShow$.next(true);
    setTimeout(() => {
      this.stateInfoMessageIsShow$.next(false);
    }, 1000);
  };

  private checkCombination = () => {
    this.processingServise.linesData.forEach((line) => {
      let temp: boolean[] = [];
      let zeroTemp: boolean[] = [];
      line.coordinate.forEach((num) => {
        temp.push(this.processingServise.crossCells.includes(num));
        zeroTemp.push(this.processingServise.zeroCells.includes(num));
      });
      if (!zeroTemp.includes(false) || !temp.includes(false)) {
        this.stateSomeWon$.next(true);
        this.drowLine(line);
        setTimeout(() => {
          this.finishGame(!zeroTemp.includes(false));
        }, 1500);
        return;
      }
    });
    if (!this.fieldCells.includes(false) && !this.stateSomeWon$.value) {
      this.isDraw();
    }
  };



  private setCross() {
    const filteredArrays = this.processingServise.filterLines();
    if (filteredArrays.LinesWithTwoCross.length) {
      filteredArrays.LinesWithTwoCross[0].coordinate.forEach((index) => {
        if (!this.fieldCells[index]) {
          this.setCell(index);
          this.processingServise.crossCells.push(index);
          return;
        }
      });
    } else if (filteredArrays.LinesWithTwoZero.length) {
      filteredArrays.LinesWithTwoZero[0].coordinate.forEach((index) => {
        if (!this.fieldCells[index]) {
          this.setCell(index);
          this.processingServise.crossCells.push(index);
          return;
        }
      });
    } else if (filteredArrays.LinesWithCross.length) {
      let tempIndex = 0;
      filteredArrays.LinesWithCross[0].coordinate.forEach((index) => {
        if (!this.fieldCells[index]) {
          tempIndex = index;
        }
      });
      this.setCell(tempIndex);
      this.processingServise.crossCells.push(tempIndex);

    } else {
      let tempIndex = 0;
      filteredArrays.LinesWithoutZero[0].coordinate.forEach((index) => {
        if (!this.fieldCells[index]) {
          tempIndex = index;
        }
      });
      this.setCell(tempIndex);
      this.processingServise.crossCells.push(tempIndex);
    }

  };

}

