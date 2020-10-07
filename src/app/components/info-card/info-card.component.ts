import { Component, Inject, OnInit } from '@angular/core';
import {
  SHOW_HIDE_INFO_BLOCK,
  SHOW_HIDE_INFO_BLOCK_PROVIDERS,
} from '../../providers/showHideBlock';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  providers: [SHOW_HIDE_INFO_BLOCK_PROVIDERS],
})
export class InfoCardComponent implements OnInit {
  constructor(
    @Inject(SHOW_HIDE_INFO_BLOCK) public isHide$: Observable<boolean>
  ) {}

  ngOnInit(): void {}
}
