import { Injectable } from '@angular/core';
import { lineObject, filteredArraysObject } from '../objects.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessingService {
  readonly linesData: Array<lineObject> = [
    { coordinate: [0, 1, 2], top: 15, left: 0, class: 'horizontal' },
    { coordinate: [3, 4, 5], top: 50, left: 0, class: 'horizontal' },
    { coordinate: [6, 7, 8], top: 84, left: 0, class: 'horizontal' },
    { coordinate: [0, 3, 6], top: 0, left: 16, class: 'vertical' },
    { coordinate: [1, 4, 7], top: 0, left: 50, class: 'vertical' },
    { coordinate: [2, 5, 8], top: 0, left: 83, class: 'vertical' },
    { coordinate: [0, 4, 8], top: 50, left: 0, class: 'left' },
    { coordinate: [2, 4, 6], top: 50, left: 0, class: 'right' },
  ];
  zeroCells: Array<number> = [];
  crossCells: Array<number> = [];

  constructor() { }

  filterLines(): filteredArraysObject {
    let LinesWithTwoZero: Array<lineObject> = [];
    let LinesWithTwoCross: Array<lineObject> = [];
    const LinesWithFreeCell = this.linesData.filter((line) => {
      let result = false;
      line.coordinate.forEach((numb) => {
        if (!this.crossCells.includes(numb) && !this.zeroCells.includes(numb)) {
          result = true;
        }
      });
      return result;
    });
    const LinesWithZero = LinesWithFreeCell.filter((line) => {
      let result = false;
      line.coordinate.forEach((numb) => {
        if (this.zeroCells.includes(numb)) {
          result = true;
        }
      });
      return result;
    });
    const LinesWithCross = LinesWithFreeCell.filter((line) => {
      let result = false;
      line.coordinate.forEach((numb) => {
        if (this.crossCells.includes(numb)) {
          result = true;
        }
      });
      return result;
    });
    const LinesWithoutZero = LinesWithFreeCell.filter((line) => {
      let result = true;
      line.coordinate.forEach((numb) => {
        if (this.zeroCells.includes(numb)) {
          result = false;
        }
      });
      return result;
    });
    if (LinesWithZero.length > 1) {
      const tempArr = LinesWithZero.filter((item) => {
        let count = 0;
        let result = false;
        item.coordinate.forEach((numb) => {
          if (this.zeroCells.includes(numb)) {
            count++;
          }
        });
        if (count === 2) {
          result = true;
        }
        return result;
      });
      if (tempArr.length > 0) {
        LinesWithTwoZero = [...tempArr];
      }
    }
    if (LinesWithCross.length > 1) {
      const tempArr = LinesWithCross.filter((item) => {
        let count = 0;
        let result = false;
        item.coordinate.forEach((numb) => {
          if (this.crossCells.includes(numb)) {
            count++;
          }
        });
        if (count === 2) {
          result = true;
        }
        return result;
      });
      if (tempArr.length > 0) {
        LinesWithTwoCross = [...tempArr];
      }
    }
    return {
      LinesWithFreeCell: LinesWithFreeCell,
      LinesWithZero: LinesWithZero,
      LinesWithoutZero: LinesWithoutZero,
      LinesWithCross: LinesWithCross,
      LinesWithTwoCross: LinesWithTwoCross,
      LinesWithTwoZero: LinesWithTwoZero,
    };
  }
}
