import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model: any = {};
  username: string;

  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    if (!!localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    } else {
      this.username = this.authService.name;
    }
  }

  login() {
    console.log(this.model);
    if (!this.authService.login(this.model)) {
      this.alertify.error('Wrong username or password');
    } else {
      this.alertify.success('Logged in successfully!');
      this.router.navigate(['/']);
    }
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('username');
    this.authService.name = null;
    this.alertify.warning('Logged out successfully!');
    this.router.navigate(['/']);
  }
}
