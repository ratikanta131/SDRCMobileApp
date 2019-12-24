import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueRegisterPage } from './issue-register.page';

const routes: Routes = [
  {
    path: '',
    component: IssueRegisterPage
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueRegisterPageRoutingModule {}
