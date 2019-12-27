import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private authService: AuthService) {}
  canLoad(route: Route, segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.checkLoggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
