import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { SyncService } from 'src/app/service/sync.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/loading.service';
import { ToastController } from '@ionic/angular';
var thisObject;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(private router: Router,
              private loadingService: LoadingService,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private syncService: SyncService) { }

  ngOnInit() {
    this.authService.setLoggedInUser();
  }

  OpenList() {
    this.router.navigateByUrl('/issueRegister');
  }

  ionViewDidEnter() {
    this.sync();
  }

  async sync() {
    const flag = await this.syncService.isMasterDataPresent();
    if (!flag) {
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
        console.log('sync success');
        this.loadingService.dismissLoader();
      }
      );
    }
  }

  handleError(error: HttpErrorResponse) {
    thisObject.loadingService.dismissLoader();
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

  async openToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnDestroy(): void {
    thisObject = null;
  }

}
