import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingComponent } from './trading.component';
import { Routes, RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GraphicComponent } from './graphic/graphic.component';
import { WebsocketService } from '../shared/services/websocket.service';
import { WsHandlerService } from '../shared/services/ws-handler.service';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TradingService } from './shared/trading.service';


const routes: Routes = [
  { path: '', component: TradingComponent }
];

@NgModule({
  declarations: [TradingComponent, GraphicComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatSliderModule,
    MatSelectModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    AngularResizedEventModule

  ],
  providers: [WebsocketService, WsHandlerService, TradingService]
})
export class TradingModule { }
