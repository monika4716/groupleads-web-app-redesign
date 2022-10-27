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

  verifyUserToken(loadList = false) {
    // this.spinner.show();
    var tokenTemp = localStorage.getItem('token');

    this.apiService.refreshToken(tokenTemp).subscribe(
      (response: any) => {
        if (response['status'] == 404) {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
          //this.spinner.hide();
        } else if (response['status'] == 200) {
          this.token = response['token'];
          localStorage.removeItem('token');
          localStorage.setItem('token', this.token);
          //this.spinner.hide();

          if (loadList) {
            // this.groupList();
          }
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
      // let clearData = {};
      this.apiService.updateGroupOverview({}); // to clear behaviour variable. (to fix if different user is login then it display old user data in behaviour subject)
    }, 100);

    this.router.navigate(['login']);
  }
}
