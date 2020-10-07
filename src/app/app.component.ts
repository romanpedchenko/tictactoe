import {
  Component,
  Inject,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { TictactoeService } from './services/tictactoe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(
    public tictactoe: TictactoeService,
    @Inject(Renderer2) private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.tictactoe.clickedCells$.subscribe(console.log);
  }

  resetGame(): void {
    this.tictactoe.clickedCells$.getValue().forEach((item, i) => {
      const cssClass = i % 2 === 0 ? 'ch' : 'r';
      this.renderer.removeClass(item.element, cssClass);
      this.renderer.removeClass(item.element, 'win');
      this.renderer.removeClass(item.element, 'horizontal');
      this.renderer.removeClass(item.element, 'vertical');
      this.renderer.removeClass(item.element, 'diagonal-right');
      this.renderer.removeClass(item.element, 'diagonal-left');
    });
    this.tictactoe.clickedCells$.next([]);
    this.tictactoe.updateIsWin(false);
  }
}
