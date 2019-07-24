import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingComponent } from './trading.component';
import { Routes, RouterModule } from '@angular/router';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';



import { ReactiveFormsModule } from '@angular/forms';
import { GraphicComponent } from './graphic/graphic.component';
import {WebsocketService} from '../shared/services/websocket.service';
import { WsHandlerService } from '../shared/services/ws-handler.service';


const routes: Routes = [
  { path: '', component: TradingComponent},
  { path: 'graphic', component: GraphicComponent}
];

@NgModule({
  declarations: [TradingComponent, GraphicComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  providers: [WebsocketService, WsHandlerService]
})
export class TradingModule { }
