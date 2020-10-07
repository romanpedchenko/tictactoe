import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ClickedItem = {
  id: number;
  element: HTMLDivElement | null;
};

@Injectable({
  providedIn: 'root',
})
export class TictactoeService {
  public clickedCells$ = new BehaviorSubject<ClickedItem[]>([]);
  private readonly isWin$$ = new BehaviorSubject<boolean>(false);
  public isWin$ = this.isWin$$.pipe();

  constructor() {}

  updateIsWin(value: boolean): void {
    this.isWin$$.next(value);
  }
}
