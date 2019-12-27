import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { Constants } from 'src/constants';


@Injectable({
  providedIn: 'root'
})
export class XhrInterceptorService {

  isRefreshTokenExpired: boolean;
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor( private router: Router, private http: HttpClient) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
      if (token) {
        return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
      } else {
        return req.clone();
      }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(this.addToken(req, localStorage.getItem('access_token')))
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse) {
          // switch (( error as HttpErrorResponse).status) {
          //   // case 400:
          //   //   return this.handle400Error(error);
          //   case 401:
          //     return this.handle401Error(req, next);
          // }
          return throwError(error);
        } else {
          return throwError(error);
        }
      }));
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url =='https://devserver.sdrc.co.in/sdrcapp/oauth/token') {
      this.logoutUser();
    }
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      return this.refreshToken()
        .pipe(switchMap((refreshToken: string) => {
          if (refreshToken) {
            this.tokenSubject.next(refreshToken);
            this.isRefreshingToken = false;
            return next.handle(this.addToken(req, refreshToken));

          }
          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        }))
        .pipe(catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        }))
        .pipe(finalize(() => {
          this.isRefreshingToken = false;
        }));
      // });

    } else {
      return this.tokenSubject
        .pipe(filter(token => token != null))
        .pipe(take(1))
        .pipe(switchMap(token => {
          return next.handle(this.addToken(req, token));
        }));
    }
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      this.deleteCookies();
    }
    return Observable.throw(error);
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    this.deleteCookies();
    window.location.href = 'login'
    return throwError('');
  }

  deleteCookies() {
    localStorage.clear();
  }

  refreshToken(): Observable<string> {
    const tokenObsr = new Subject<string>();
    const token_refreshed = localStorage.getItem('refresh_token');

    if (token_refreshed) {

        const URL: string = Constants.HOME_URL + 'oauth/token';
        const httpOptions = {
          headers: new HttpHeaders({
              'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          })
      };
        const params = new URLSearchParams();
        params.append('refresh_token', localStorage.getItem('refresh_token'));
        params.append('grant_type', 'refresh_token');

        this.http.post<UserToken>(URL, params.toString(), httpOptions)
            .subscribe(response => {

                localStorage.setItem('access_token', response.access_token);

                tokenObsr.next(response.access_token);

            }, err => {
                this.logoutUser();
            });
    }
    return tokenObsr.asObservable();
  }
}

interface UserToken {
  access_token: string;
  refresh_token: string;
}
