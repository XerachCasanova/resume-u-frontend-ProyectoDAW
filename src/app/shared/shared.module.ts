import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeadersComponent } from './header/headers.component';

@NgModule({
  declarations: [HeadersComponent],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [HeadersComponent],
})
export class SharedModule {}
