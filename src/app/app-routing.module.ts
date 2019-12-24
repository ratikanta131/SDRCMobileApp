import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './page/login/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './page/login/auth.module#AuthPageModule'
  },
  {
    path: 'home',
    loadChildren: './page/home/home.module#HomePageModule', canLoad: [AuthGuard]
  },
  {
    path: 'issue-register',
    loadChildren: './page/issue-register/issue-register.module#IssueRegisterPageModule', canLoad: [AuthGuard]
  },
  {
    path: 'team',
    loadChildren: './page/team/team.module#TeamPageModule', canLoad: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
