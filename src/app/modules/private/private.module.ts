import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { ValidatorsModule } from 'src/app/core/validators/validators.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LanguageComponent } from './language/language.component';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { UsersDataComponent } from './users-data/users-data.component';


@NgModule({
  declarations: [PrivateComponent, UsersDataComponent, LanguageComponent,],
  imports: [PrivateRoutingModule, SharedModule,ReactiveFormsModule, MatButtonModule,
    FormsModule,
    ValidatorsModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
  ],
  exports: [PrivateComponent],
})
export class PrivateModule {}
