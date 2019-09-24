import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ScrollableDirective } from './scrollable.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { PaginationService } from './pagination.service';
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent, ScrollableDirective, LoadingSpinnerComponent],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [PaginationService, AngularFireDatabase, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule {}
