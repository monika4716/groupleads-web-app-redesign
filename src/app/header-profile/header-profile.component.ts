import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.css'],
})
export class HeaderProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {}
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
