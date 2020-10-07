import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  concat,
  fromEvent,
  partition,
  ReplaySubject,
} from 'rxjs';
import {
  filter,
  map,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import {
  ClickedItem,
  TictactoeService,
} from '../../services/tictactoe.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit, AfterViewInit {
  @ViewChild('field', { read: ElementRef })
  public field: ElementRef<HTMLDivElement> | undefined;

  public readonly rows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  private wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  private destroy$: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    @Inject(Renderer2) private readonly renderer: Renderer2,
    private tictactoe: TictactoeService
  ) {}

  ngOnInit(): void {
    const [even, odd] = partition(
      this.tictactoe.clickedCells$,
      (arr) => arr.length % 2 === 0
    );

    const even$ = even.pipe(takeUntil(this.destroy$));
    const odd$ = odd.pipe(takeUntil(this.destroy$));

    concat(even$, this.tictactoe.clickedCells$)
      .pipe(
        map((cells: ClickedItem[]) => cells[cells.length - 1]),
        takeUntil(this.destroy$)
      )
      .subscribe(({ element: el } = { element: null, id: 0 }) => {
        if (!el) {
          return;
        }
        this.addCssClass(el, 'r');
      });

    concat(odd$, this.tictactoe.clickedCells$)
      .pipe(
        map((cells: ClickedItem[]) => cells[cells.length - 1]),
        takeUntil(this.destroy$)
      )
      .subscribe(({ element: el }) => {
        if (!el) {
          return;
        }
        this.addCssClass(el, 'ch');
      });

    const moreThenFive$ = this.tictactoe.clickedCells$.pipe(
      filter((arr: ClickedItem[]) => arr.length > 5),
      takeUntil(this.destroy$)
    );

    concat(even$, moreThenFive$)
      .pipe(map((arr: ClickedItem[]) => arr.filter((_, i) => i % 2 !== 0)))
      .subscribe((playerEven) => this.checkWinCombination(playerEven));

    concat(odd$, moreThenFive$)
      .pipe(map((arr: ClickedItem[]) => arr.filter((_, i) => i % 2 === 0)))
      .subscribe((playerOdd) => this.checkWinCombination(playerOdd));
  }

  ngAfterViewInit(): void {
    if (!this.field) {
      return;
    }

    const click$ = fromEvent(this.field.nativeElement, 'click').pipe(
      takeUntil(this.destroy$)
    );

    click$
      .pipe(
        withLatestFrom(this.tictactoe.isWin$),
        filter(([e, isWin]) => Boolean(e.target) && !isWin)
      )
      .subscribe(([{ target }]) => {
        const id = Number((target as HTMLDivElement).getAttribute('data-id'));
        if (!id) {
          return;
        }
        this.tictactoe.clickedCells$.pipe(take(1)).subscribe((current) => {
          this.tictactoe.clickedCells$.next([
            ...current,
            { id, element: target as HTMLDivElement },
          ]);
        });
      });
  }

  private addCssClass(el: HTMLDivElement, cssClass: string): void {
    this.renderer.addClass(el, cssClass);
  }

  private checkWinCombination(player: ClickedItem[]): void {
    const combination = player.map(({ id }) => id);
    const [winCombination] = this.wins.filter((win) =>
      win.every((el) => combination.includes(el))
    );
    if (!winCombination) {
      return;
    }

    this.tictactoe.updateIsWin(true);
    const cssWinClass = this.getCssWinClass(winCombination);

    player
      .filter(({ id }) => winCombination.includes(id))
      .forEach(({ element: el }) => {
        if (!el) {
          return;
        }

        this.addCssClass(el, 'win');
        this.addCssClass(el, cssWinClass);
      });
  }

  private getCssWinClass([a, b, c]: number[]): string {
    if (a + 1 === b && b + 1 === c) {
      return 'horizontal';
    }

    if (a + 3 === b && b + 3 === c) {
      return 'vertical';
    }

    if (a + 4 === b && b + 4 === c) {
      return 'diagonal-right';
    }

    return 'diagonal-left';
  }
}
