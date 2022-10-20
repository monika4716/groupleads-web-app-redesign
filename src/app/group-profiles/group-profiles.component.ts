import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-group-profiles',
  templateUrl: './group-profiles.component.html',
  styleUrls: ['./group-profiles.component.css'],
})
export class GroupProfilesComponent implements OnInit {
  token: any;
  groupProfiles: any = [];
  id: any;
  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.apiService.getGroupProfile().subscribe((response) => {
      if (
        Object.keys(response).length === 0 &&
        response.constructor === Object
      ) {
        if (localStorage.getItem('token') != null) {
          this.spinner.show();
          this.getGroupDetails();
        }
      } else {
        if (response.hasOwnProperty('groupProfile')) {
          this.groupProfiles = response.groupProfile;
          this.spinner.hide();
        }
      }
    });
  }

  //---------------GET GROUPS DETAILS------------------//

  getGroupDetails() {
    this.token = localStorage.getItem('token');
    this.apiService.getGroupDetails(this.token).subscribe((response: any) => {
      if (response.status == 200) {
        this.groupProfiles = response.groupProfile;
        this.apiService.updateGroupProfile(response);
        this.spinner.hide();
      }
    });
  }
}
