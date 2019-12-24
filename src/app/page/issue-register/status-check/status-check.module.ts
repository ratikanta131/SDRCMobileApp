import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { StatusCheckComponent } from './status-check.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [StatusCheckComponent],
  entryComponents: [StatusCheckComponent],
  exports: [StatusCheckComponent]
})
export class StatusCheckComponentModule {}
