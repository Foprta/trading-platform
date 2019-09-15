import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthComponent } from './auth.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    AuthComponent,    
    LoginComponent, 
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule, 
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule
  ]
})
export class AuthModule { }
