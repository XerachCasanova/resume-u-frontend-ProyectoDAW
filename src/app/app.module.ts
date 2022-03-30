import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { IndexModule } from './modules/index/index.module';
import { LoginComponent } from './modules/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersFormComponent } from './modules/users/users-form.component';
import { usersFormModalComponent } from './modules/users/modals/users-form-modal.component';
import { ValidatorsModule } from './core/validators/validators.module';
import { AuthInterceptorService } from './modules/login/auth.interceptor';
import { RepeatPasswordValidatorDirective } from './core/validators/repeatpassword.component';
import { PostalCodeValidatorDirective } from './core/validators/postalcode.validator';
import { GenericControlsModule } from './core/generic-controls/generic-controls.module';



@NgModule({
  declarations: [AppComponent, LoginComponent, UsersFormComponent, usersFormModalComponent],
  imports: [

    GenericControlsModule,
    ValidatorsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    IndexModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  exports: [RepeatPasswordValidatorDirective, PostalCodeValidatorDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
