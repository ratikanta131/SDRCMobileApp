import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { AssignItemComponent } from './assign-item.component';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule
  ],
  declarations: [AssignItemComponent],
  entryComponents: [AssignItemComponent],
  exports: [AssignItemComponent]
})
export class AssignItemComponentModule {}
