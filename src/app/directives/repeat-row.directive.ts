import {
  ComponentFactoryResolver,
  Directive,
  Inject,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { CellComponent } from '../components/cell/cell.component';

@Directive({
  selector: '[appRepeatRow]',
})
export class RepeatRowDirective {
  @Input()
  set appRepeatRow(cells: number[]) {
    cells.forEach((cell) => {
      const cellComponent = this.componentFactory.resolveComponentFactory(
        CellComponent
      );
      const { instance } = this.viewContainer.createComponent(cellComponent);
      instance.dataId = cell;
    });
  }

  constructor(
    @Inject(ViewContainerRef) private readonly viewContainer: ViewContainerRef,
    @Inject(ComponentFactoryResolver)
    private readonly componentFactory: ComponentFactoryResolver
  ) {}
}
