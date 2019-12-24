import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  hide = true;
  credentials: any = {
    username: '',
    password: ''
  };
  newPassword: any;
  confirmPassword: any;
  form: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
  onSwitchAuth() {
    this.router.navigateByUrl('/login/signup');
  }
  login() {
    this.authService.authenticate(this.credentials);
  }

}
