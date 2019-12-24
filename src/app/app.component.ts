import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './page/login/auth.service';
import { Router } from '@angular/router';
import { SyncService } from './service/sync.service';
import { IUserInfo } from './interface/userInfo';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: IUserInfo;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  syncItem: any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private syncService: SyncService,
  ) {
    this.initializeApp();
    this.authService.user.subscribe(user => {
      this.user = user;
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  onSync() {
    this.syncService.syncData();
  }

}
