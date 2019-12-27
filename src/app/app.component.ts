import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './page/login/auth.service';
import { Router } from '@angular/router';
import { SyncService } from './service/sync.service';
import { IUserInfo } from './interface/userInfo';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { LoadingService } from './loading.service';
var thisObject;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: IUserInfo;
  loading: any;
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
    private toastCtrl: ToastController,
    private loadingService: LoadingService
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
  async onSync() {
    thisObject = this;
    this.loadingService.presentLoader('Syncing master data, please wait...');
    this.syncService.syncData()
    .pipe(
      catchError(this.handleError)
    )
    .subscribe(
      async responseList => {
        await this.syncService.saveItem(responseList[0]);
        await this.syncService.saveUsers(responseList[1]);
        this.loadingService.dismissLoader();
      }
    );
  }


  async openToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  handleError(error: HttpErrorResponse) {
    setTimeout(() => {
      thisObject.loadingService.dismissLoader();
    }, 1000);
    if (error.status === 0) {
        thisObject.openToast(`Please check your internet connection.`);
    } else {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        thisObject.openToast('An error occurred:' + error.error.message);
      } else {
        switch (error.status) {
          case 401:
            thisObject.openToast(error.error.error_description);
            thisObject.authService.logout();
            thisObject.router.navigateByUrl('/login');
            break;
          case 403:
            thisObject.openToast(error.error.error_description);
            break;
          default:
            thisObject.openToast(error.error.message);
            break;
        }
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }
  }

}
