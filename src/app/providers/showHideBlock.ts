import { InjectionToken, Provider } from '@angular/core';
import { TictactoeService } from '../services/tictactoe.service';
import { merge, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export const SHOW_HIDE_INFO_BLOCK = new InjectionToken(
  'Info block is shown when someone is win or there is a tie'
);

export const SHOW_HIDE_INFO_BLOCK_PROVIDERS: Provider[] = [
  {
    provide: SHOW_HIDE_INFO_BLOCK,
    deps: [TictactoeService],
    useFactory: userFactory,
  },
];

export function userFactory(service: TictactoeService): Observable<boolean> {
  return merge(
    service.isWin$,
    service.clickedCells$.pipe(
      tap(console.log),
      filter((arr) => arr.length === 9),
      map(() => true)
    ) as Observable<boolean>
  );
}
