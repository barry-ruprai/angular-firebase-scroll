import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public page: PaginationService) {}

  ngOnInit() {
    this.page.init('boats', 'year', { reverse: true, prepend: false });
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more();
    }
  }
}
