import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { HistoryItemComponent } from './history-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [HistoryItemComponent],
  entryComponents: [HistoryItemComponent],
  exports: [HistoryItemComponent]
})
export class HistoryItemComponentModule {}
