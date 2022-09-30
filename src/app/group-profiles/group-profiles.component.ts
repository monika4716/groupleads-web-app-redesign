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
  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getGroupDetails();
  }

  getGroupDetails() {
    this.token = localStorage.getItem('token');
    console.log(this.token);
    this.apiService.getGroupDetails(this.token).subscribe((response: any) => {
      console.log(response);
      if (response.status == 200) {
        // this.linkedGroups = response.Linked_groups;
        // this.setAdminBioValue(response);
        // this.spinner.hide();
      }
    });
  }
}
