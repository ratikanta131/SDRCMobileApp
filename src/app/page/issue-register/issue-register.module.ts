import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueRegisterPageRoutingModule } from './issue-register-routing.module';

import { IssueRegisterPage } from './issue-register.page';
import { CreateItemComponentModule } from './create-item/create-item.module';
import { AssignItemComponentModule } from './assign-item/assign-item.module';
import { StatusCheckComponentModule } from './status-check/status-check.module';
import { IssueRegisterService } from './issue-register.service';
import { HistoryItemComponentModule } from './history-item/history-item.module';
import { PipesModule } from '../pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueRegisterPageRoutingModule,
    CreateItemComponentModule,
    AssignItemComponentModule,
    StatusCheckComponentModule,
    HistoryItemComponentModule,
    PipesModule
  ],
  providers: [IssueRegisterService],
  declarations: [IssueRegisterPage]
})
export class IssueRegisterPageModule {}
