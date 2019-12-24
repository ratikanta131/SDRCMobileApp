import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamPageRoutingModule } from './team-routing.module';

import { TeamPage } from './team.page';
import { CreateTeamComponentModule } from './create-team/create-team.module';
import { UserStatusComponentModule } from './user-status/user-status.module';
import { UserHistoryComponentModule } from './user-history/user-history.module';
import { PipesModule } from '../pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamPageRoutingModule,
    CreateTeamComponentModule,
    UserStatusComponentModule,
    UserHistoryComponentModule,
    PipesModule
  ],
  declarations: [TeamPage]
})
export class TeamPageModule {}
