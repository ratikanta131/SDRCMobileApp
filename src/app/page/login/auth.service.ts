import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Constants
} from 'src/constants';
import {
  Router
} from '@angular/router';
import {
  Storage
} from '@ionic/storage';
import {
  IUserInfo
} from 'src/app/interface/userInfo';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser: IUserInfo;
  user = new EventEmitter < IUserInfo > ();

  constructor(private http: HttpClient,
              private router: Router,
              private storage: Storage) {}

  checkLoggedIn(): boolean {
    if (!localStorage.getItem('access_token')) {
      return false;
    } else {
      return true;
    }
  }

  async logout() {
    this.http.delete(Constants.HOME_URL + 'oauth/logout').subscribe(data => {});
    this.clearLocalStorage();
    this.router.navigateByUrl('/');
    await this.storage.remove(Constants.DATABASE_KEYS.userInfo);
    this.loggedInUser = null;
    this.user.emit(this.loggedInUser);
  }


  clearLocalStorage() {
    localStorage.clear();
  }


  getToken(): any {
    return localStorage.getItem('access_token');
  }

  callServer(credentials: {
    'username': string,
    'password': string
  }) {
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
    return this.http.post(URL, params.toString(), httpOptions);
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

  getUserInfo(tokensInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + tokensInfo.access_token,
        'Content-type': 'application/json'
      })
    };
    return this.http.get(Constants.HOME_URL + 'oauth/user', httpOptions);
  }

  async setUserInfoToDatabase(userInfo: any) {
    await this.storage.set(Constants.DATABASE_KEYS.userInfo, userInfo);
    this.loggedInUser = userInfo;
    this.user.emit(userInfo);
    return;
  }

}
