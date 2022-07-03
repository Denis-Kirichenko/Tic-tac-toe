export interface lineObject {
  coordinate: Array<number>;
  top: number;
  left: number;
  class: string;
}

export interface filteredArraysObject {
  LinesWithFreeCell: Array<lineObject>;
  LinesWithZero: Array<lineObject>;
  LinesWithoutZero: Array<lineObject>;
  LinesWithCross: Array<lineObject>;
  LinesWithTwoCross: Array<lineObject>;
  LinesWithTwoZero: Array<lineObject>;
}
