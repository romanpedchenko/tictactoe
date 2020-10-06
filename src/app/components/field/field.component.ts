import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, concat, fromEvent, partition, Subject } from 'rxjs';
import {
  filter,
  last,
  map,
  pairwise,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { element } from 'protractor';

type ClickedItem = {
  id: number;
  element: HTMLDivElement | null;
};

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

  public clickedCells$ = new BehaviorSubject<ClickedItem[]>([]);

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

  constructor(@Inject(Renderer2) private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    const [even, odd] = partition(
      this.clickedCells$,
      (arr) => arr.length % 2 === 0
    );

    concat(even, this.clickedCells$)
      .pipe(map((cells: ClickedItem[]) => cells[cells.length - 1]))
      .subscribe(({ element: el } = { element: null, id: 0 }) => {
        if (!el) {
          return;
        }
        this.addCssClass(el, 'r');
      });

    concat(odd, this.clickedCells$)
      .pipe(map((cells: ClickedItem[]) => cells[cells.length - 1]))
      .subscribe(({ element: el }) => {
        if (!el) {
          return;
        }
        this.addCssClass(el, 'ch');
      });

    const moreThenFive$ = this.clickedCells$.pipe(
      filter((arr: ClickedItem[]) => arr.length > 5)
    );

    concat(even, moreThenFive$)
      .pipe(map((arr: ClickedItem[]) => arr.filter((_, i) => i % 2 !== 0)))
      .subscribe((playerEven) => {
        const combination = playerEven.map(({ id }) => id);
        const [winCombination] = this.wins.filter((win) =>
          win.every((el) => combination.includes(el))
        );

        if (!winCombination) {
          return;
        }

        const cssWinClass = this.getCssWinClass(winCombination);

        playerEven
          .filter(({ id }) => winCombination.includes(id))
          .forEach(({ element: el }) => {
            if (!el) {
              return;
            }

            this.addCssClass(el, 'win');
            this.addCssClass(el, cssWinClass);
          });
      });

    concat(odd, moreThenFive$)
      .pipe(map((arr: ClickedItem[]) => arr.filter((_, i) => i % 2 === 0)))
      .subscribe((playerOdd) => {
        const combination = playerOdd.map(({ id }) => id);
        const [winCombination] = this.wins.filter((win) =>
          win.every((el) => combination.includes(el))
        );
        if (!winCombination) {
          return;
        }

        const cssWinClass = this.getCssWinClass(winCombination);

        playerOdd
          .filter(({ id }) => winCombination.includes(id))
          .forEach(({ element: el }) => {
            if (!el) {
              return;
            }

            this.addCssClass(el, 'win');
            this.addCssClass(el, cssWinClass);
          });
      });
  }

  ngAfterViewInit(): void {
    if (!this.field) {
      return;
    }

    fromEvent(this.field.nativeElement, 'click')
      .pipe(filter((e) => Boolean(e.target)))
      .subscribe(({ target }) => {
        const id = Number((target as HTMLDivElement).getAttribute('data-id'));
        this.clickedCells$.pipe(take(1)).subscribe((current) => {
          this.clickedCells$.next([
            ...current,
            { id, element: target as HTMLDivElement },
          ]);
        });
      });
  }

  private addCssClass(el: HTMLDivElement, cssClass: string): void {
    this.renderer.addClass(el, cssClass);
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
