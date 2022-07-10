import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import '@fortawesome/fontawesome-free/js/all.js';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as _ from 'lodash';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import {TooltipModule} from 'primeng/tooltip';
@NgModule({
  declarations: [
    AppComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
