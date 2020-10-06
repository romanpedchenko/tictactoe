import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FieldComponent,
  ButtonComponent,
  CellComponent,
  RowComponent,
} from './components';
import { RepeatRowDirective } from './directives/repeat-row.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    ButtonComponent,
    CellComponent,
    RowComponent,
    RepeatRowDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
