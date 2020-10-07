import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FieldComponent,
  ButtonComponent,
  CellComponent,
  RowComponent,
} from './components';
import { RepeatRowDirective } from './directives/repeat-row.directive';
import { InfoCardComponent } from './components/info-card/info-card.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    ButtonComponent,
    CellComponent,
    RowComponent,
    RepeatRowDirective,
    InfoCardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
