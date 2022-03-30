import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GenericButtonComponent } from './generic-button.component';

@NgModule({
  declarations: [GenericButtonComponent],
  imports: [
    CommonModule,
  ],
  exports: [GenericButtonComponent],
})
export class GenericControlsModule {}
