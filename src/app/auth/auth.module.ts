import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './pages/main/main.component';

import { ImportMaterialModule } from '../modules/import-material.module';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TerminosCondicionesDialogComponent } from './components/terminos-condiciones-dialog/terminos-condiciones-dialog.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ForgotPasswordComponent,
    TerminosCondicionesDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ImportMaterialModule
  ]
})
export class AuthModule { }
