import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  token: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private cookie: CookieService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    setInterval(() => {
      this.verifyUserToken();
    }, 7 * 60000);
  }

  verifyUserToken() {
    console.log('verifyUserToken');
    var tokenTemp = localStorage.getItem('token');
    this.apiService.refreshToken(tokenTemp).subscribe(
      (response: any) => {
        console.log(response);
        if (response['status'] == 404) {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        } else if (response['status'] == 200) {
          this.token = response['token'];
          localStorage.removeItem('token');
          localStorage.setItem('token', this.token);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    setTimeout(() => {
      this.apiService.updateGroupOverview({}); // to clear behaviour variable. (to fix if different user is login then it display old user data in behaviour subject)
    }, 100);

    this.router.navigate(['login']);
  }
}
