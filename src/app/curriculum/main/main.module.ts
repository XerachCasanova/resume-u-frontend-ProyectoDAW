import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';
import { GenericControlsModule } from 'src/app/core/generic-controls/generic-controls.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, SharedModule, MainRoutingModule, GenericControlsModule],
  exports: [MainComponent],
})
export class MainModule {}
