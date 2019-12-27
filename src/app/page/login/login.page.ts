import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from 'src/app/service/util.service';
import { LoadingService } from 'src/app/loading.service';
import { Constants } from 'src/constants';
var thisObject;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  hide = true;
  credentials: any = {
    username: '',
    password: ''
  };
  newPassword: any;
  confirmPassword: any;
  form: FormGroup;

  constructor(private router: Router, private authService: AuthService,
              private utilService: UtilService,
              private loadingService: LoadingService) { }

  ngOnInit() {
  }
  login() {
    thisObject = this;
    this.loadingService.presentLoader('Logging in, please wait...');
    this.authService.callServer(this.credentials)
    .pipe(
      catchError(this.handleError)
    )
    .subscribe(response => {
      const tokensInfo: any = response;   // store the token
      localStorage.setItem('access_token', tokensInfo.access_token);
      localStorage.setItem('refresh_token', tokensInfo.refresh_token);
      this.getUserInfo(tokensInfo);
    });
  }

  getUserInfo(tokensInfo: any) {
    this.authService.getUserInfo(tokensInfo)
    .pipe(
      catchError(this.handleError)
    )
    .subscribe(async user => {
      await this.authService.setUserInfoToDatabase(user);
      this.loadingService.dismissLoader();
      this.router.navigateByUrl('/');
    });
  }

  handleError(error: HttpErrorResponse) {
    setTimeout(() => {
      thisObject.loadingService.dismissLoader();
    }, 2000);
    if (error.status === 0) {
      thisObject.utilService.openToast(`Please check your internet connection.`);
    } else {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        thisObject.openToast('An error occurred:' + error.error.message);
      } else {
        switch (error.status) {
          case (400 || 401 || 403):
            thisObject.utilService.openToast(error.error.error_description);
            break;
          default:
            thisObject.utilService.openToast(error.error.message);
            break;
        }
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }
  }

  ngOnDestroy(): void {
    thisObject = null;
  }

}
