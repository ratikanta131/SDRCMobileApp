import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { CreateItemComponent } from './create-item.component';

@NgModule({
  imports: [ CommonModule, IonicModule, FormsModule],
  declarations: [CreateItemComponent],
  entryComponents: [CreateItemComponent],
  exports: [CreateItemComponent]
})
export class CreateItemComponentModule {}
