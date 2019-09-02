import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthGuardService } from './shared/services/auth-guard.service';
import { LoginFormComponent } from './core/login-form/login-form.component';

const routes: Routes = [
  { path: 'trading', loadChildren: './trading/trading.module#TradingModule', canActivate: [AuthGuardService] },
  { path: 'login', component: LoginFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
