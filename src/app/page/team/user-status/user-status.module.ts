import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserStatusComponent } from './user-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [UserStatusComponent],
  entryComponents: [UserStatusComponent],
  exports: [UserStatusComponent]
})
export class UserStatusComponentModule {}
