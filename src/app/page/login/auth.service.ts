import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Constants } from 'src/constants';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Storage } from '@ionic/storage';
import { IUserInfo } from 'src/app/interface/userInfo';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userName: string;
  authenticated = false;
  logoutSuccess = false;
  validationMsg: any;
  tokensInfo: any;
  userInfo: any;
  loggedInUser: IUserInfo;
  user = new EventEmitter<IUserInfo>();

constructor(private http: HttpClient, private router: Router,
            private storage: Storage) {
  }

  checkLoggedIn(): boolean {
    if (!localStorage.getItem('access_token')) {
      return false;
    } else {
      return true;
    }
  }

  async logout() {
    this.http.delete(Constants.HOME_URL + 'oauth/logout').subscribe(data => { });
    this.clearLocalStorage();
    this.router.navigateByUrl('/');
    await this.storage.remove(Constants.DATABASE_KEYS.userInfo);
    this.logoutSuccess = true;
    setTimeout(() => {
      this.logoutSuccess = false;
    }, 2000);
    this.loggedInUser = null;
    this.user.emit(this.loggedInUser);
  }


  clearLocalStorage() {
    localStorage.clear();
  }


  getToken(): any {
    return localStorage.getItem('access_token');
  }

authenticate(credentials: {'username': string, 'password': string}) {
        this.authenticated = false;
        this.callServer(credentials).subscribe(response => {
          this.tokensInfo = response;   // store the token
          localStorage.setItem('access_token', this.tokensInfo.access_token);
          localStorage.setItem('refresh_token', this.tokensInfo.refresh_token);
          const httpOptions = {
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.tokensInfo.access_token,
              'Content-type': 'application/json'
            })
          };
          this.http.get(Constants.HOME_URL + 'oauth/user', httpOptions).subscribe(user => {

            this.userInfo = JSON.stringify(user);
            const userInfo: IUserInfo = user as IUserInfo;
            this.storage.set(Constants.DATABASE_KEYS.userInfo, userInfo).then(() => {
              this.setLoggedInUser();
              this.router.navigateByUrl('/');
              this.authenticated = true;
            });
          });
        }, error => {
          if (error === 'User is disabled') {
            this.validationMsg = 'Given username has been disabled. Please contact your admin';
          } else if (error === 'Invalid Credentials !' || error === 'Bad credentials') {
            this.validationMsg = 'The Username/Password you have entered is incorrect.';
          }
          setTimeout(() => {
            this.validationMsg = '';
          }, 3000);
        });
      }

private callServer(credentials: {'username': string, 'password': string}) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          })
        };
        const URL: string = Constants.HOME_URL + 'oauth/token';
        const params = new URLSearchParams();
        params.append('username', credentials.username);
        params.append('password', credentials.password);
        params.append('grant_type', 'password');
        return this.http.post(URL, params.toString(), httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }

private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error.error_description}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          // 'Something bad happened; please try again later.');
          error.error.error_description);
      }

      checkUserAuthorization(route) {
        let token = null;
        const expectedRoles = route;
        if (localStorage.getItem('access_token')) {
          token = JSON.parse(localStorage.getItem('user_details'));
        }
        let flag = false;
        if (this.userInfo) {
          expectedRoles.forEach( expectedRole => {
            for (const authority of token.authorities) {
              if (authority === expectedRole) {
                flag = true;
              }
            }
          });
        }
        return flag;
      }

      async setLoggedInUser() {
        this.loggedInUser = await this.storage.get(Constants.DATABASE_KEYS.userInfo);
        this.user.emit(this.loggedInUser);
      }

      checkAuthority(authority: string) {
        if ((
          (this.loggedInUser.authorities as string[])
        .findIndex(d => d === authority)) > -1) {
          return true;
        }
        return false;

      }

}
