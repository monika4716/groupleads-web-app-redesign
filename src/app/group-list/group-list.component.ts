import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent implements OnInit {
  Nogroup: boolean = false;
  token;
  subscription: any;
  groupsTemp: any = [];
  groupsData: any = [];
  cols: any = [];
  id: any;
  fbGroupIdFilter: any;
  listingUpdated: boolean = false;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.token = localStorage.getItem('token');
    this.cols = [
      { field: 'group_name', header: 'Group name' },
      { field: 'count', header: 'Total leads captured' },
      { field: 'lastUpdate', header: 'Date last captured' },
    ];

    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['group_id'];
      this.fbGroupIdFilter = params['fb_group_id'];
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    var token = localStorage.getItem('token');
    this.apiService.getGroupOverview().subscribe((response) => {
      console.log(Object.keys(response).length);
      if (response.hasOwnProperty('groupsList') && !this.listingUpdated) {
        this.listingUpdated = true;
        let tempGroups = JSON.parse(JSON.stringify(response.groupsList));
        this.groupsTemp = tempGroups;
        this.groupsData = this.groupsTemp;
        console.log(this.groupsData);
        if (!this.groupsTemp) {
          this.Nogroup = true;
        }
        this.spinner.hide();
      } else {
        this.getGroupData();
      }
    });
  }

  getGroupData() {
    this.apiService.getGroupsList(this.token).subscribe((response: any) => {
      if (response['status'] == 404) {
        this.spinner.hide();
      } else if (response['status'] == 200) {
        console.log(response);
        this.groupsTemp = response.groupList;
        this.groupsData = this.groupsTemp;
        console.log(this.groupsData);
        if (this.groupsData.length > 0) {
          this.Nogroup = true;
        }
        this.spinner.hide();
      }
    });
  }
}
