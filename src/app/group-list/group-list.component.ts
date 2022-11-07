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
  filterDropdown: any;

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
      if (response.hasOwnProperty('groupsList') && !this.listingUpdated) {
        this.listingUpdated = true;
        let tempGroups = JSON.parse(JSON.stringify(response.groupsList));
        this.groupsTemp = tempGroups;
        this.groupsData = this.groupsTemp;
        if (this.groupsData.length > 0) {
          this.Nogroup = true;
        }
        this.spinner.hide();
      } else {
        this.getGroupData();
      }
    });
  }

  /* GET GROUP DATA*/
  getGroupData() {
    this.apiService.getGroupsList(this.token).subscribe((response: any) => {
      if (response['status'] == 404) {
        this.spinner.hide();
      } else if (response['status'] == 200) {
        this.groupsTemp = response.groupList;
        this.groupsData = this.groupsTemp;
        if (this.groupsData.length > 0) {
          this.Nogroup = true;
        }
        this.spinner.hide();
      }
    });
  }

  /* FILTER ON CHANGE*/
  onChange(e: any, name: any) {
    $('li').removeClass('link');
    if (e.target.attributes.data_filter.value) {
      this.filterDropdown = e.target.attributes.data_filter.value;
      if (this.filterDropdown == 'today') {
        $('li#today').addClass('link');
      } else if (this.filterDropdown == 'this_month') {
        $('li#thisMonth').addClass('link');
      } else if (this.filterDropdown == 'last_30_days') {
        $('li#last30Days').addClass('link');
      } else if (this.filterDropdown == 'last_90_days') {
        $('li#last90Days').addClass('link');
      } else if (this.filterDropdown == 'this_year') {
        $('li#thisYear').addClass('link');
      } else if (this.filterDropdown == 'all_time') {
        $('li#allTime').addClass('link');
      }
      this.filterGridData(this.filterDropdown);
    }
    return false;
  }

  /* GET AND SHOW DATA ON FILTER CHANGE*/
  filterGridData(filterType: any) {
    this.spinner.show();
    var tokenTemp = localStorage.getItem('token');
    this.apiService
      .getGridDataByFilter(tokenTemp, { filter: filterType })
      .subscribe((response: any) => {
        this.groupsData = response.groupcountlist;
        this.spinner.hide();
      });
  }
}
