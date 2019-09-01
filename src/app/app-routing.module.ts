import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: 'trading', loadChildren: './trading/trading.module#TradingModule', canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
