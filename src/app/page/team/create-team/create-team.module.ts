import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTeamComponent } from './create-team.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule  ],
  declarations: [CreateTeamComponent],
  entryComponents: [CreateTeamComponent],
  exports: [CreateTeamComponent]
})
export class CreateTeamComponentModule {}
