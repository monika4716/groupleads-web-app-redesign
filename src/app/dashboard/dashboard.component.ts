import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CounterdisplayformatePipe } from '../pipe/counterdisplayformate.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [CounterdisplayformatePipe],
})
export class DashboardComponent implements OnInit {
  monthsArray;
  token: any;
  groups: any;
  groupsTemp: any;
  overAlltotalLeads: any;
  hasLeads: boolean = false;
  dataLoaded: boolean = false;
  groupId: any;
  selectedGroup: any = { group_id: 0 };
  selectedGroupId: any = 0;
  group_listing: any = [];
  filterDropdown: any = 'all_time';
  partocularGroup: any;
  totalLeads: any = '00';
  totalLeadsTitle: any = '00';
  selectedGroupLeads: any = '00';
  data: any;
  dateVariable: any;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.selectedGroupId =
      this.activatedRoute.snapshot.queryParamMap.get('group_id');
    if (this.selectedGroupId == null) {
      this.selectedGroupId = 0;
    }
    this.monthsArray = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'september',
      'October',
      'November',
      'December',
    ];
  }

  ngOnInit(): void {
    this.apiService.getGroupOverview().subscribe((response) => {
      if (
        Object.keys(response).length === 0 &&
        response.constructor === Object
      ) {
        if (localStorage.getItem('token') != null) {
          this.token = localStorage.getItem('token');
          // to not trigger the api when we clear subject data after user logout
          this.spinner.show();
          this.getGroupsList();
          this.getAllLeadsCount();
        }
      } else {
        if (response.hasOwnProperty('groupsList')) {
          this.groupsTemp = response.groupsList;
          this.group_listing = response.groupsList;
          this.groups = response.groupsList;
          let index = response.groupsList.findIndex(
            (x: any) => x.group_id == this.selectedGroupId
          );
          if (index >= 0) {
            this.selectedGroup = this.group_listing[index];
          }
        }
        if (response.hasOwnProperty('totalLeads')) {
          this.overAlltotalLeads = response.totalLeads;
          this.totalLeadsTitle = response.totalLeads;
          this.totalLeads = response.totalLeads;
          this.hasLeads = this.overAlltotalLeads > 0 ? true : false;
        }
        if (
          this.groupsTemp != undefined &&
          this.overAlltotalLeads != undefined
        ) {
          this.dataLoaded = true;
        }
        // once all data loaded then hide loader
        if (
          response.hasOwnProperty('groupsList') &&
          response.hasOwnProperty('totalLeads')
        ) {
          this.filterGraphData();
        }
      }
    });
  }
  /* Get Group List */
  getGroupsList() {
    var id = this.groupId;
    this.apiService.getGroupsList(this.token).subscribe(
      (response: any) => {
        if (response['status'] == 404) {
          this.spinner.hide();
        } else if (response['status'] == 200) {
          this.group_listing = response['groupList'];
          var temp = response['groupList'];
          temp.unshift({ group_id: '0', group_name: 'All Groups' });
          this.groups = temp;
          let data = this.apiService.getGroupOverviewValue();
          data.groupsList = temp;
          this.apiService.updateGroupOverview(data);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*Get All Leads Count  */
  getAllLeadsCount() {
    this.apiService.getAllLeadsCount(this.token).subscribe((response: any) => {
      if (response['status'] == 404) {
        this.spinner.hide();
      } else if (response['status'] == 200) {
        let temp = this.apiService.getGroupOverviewValue();
        temp.totalLeads = response.totalLeads;
        this.apiService.updateGroupOverview(temp);
      }
    });
  }

  /* Group Selection */
  onChangeGroup(e: any) {
    this.partocularGroup = this.groups.filter(function (item: any) {
      return item.group_id == e.target.value;
    });
    var groupName = this.partocularGroup[0].group_name;
    var groupId = e.target.value;

    var parameters = {};
    if (groupId != '0') {
      parameters = { group_id: groupId };
    }
    var pathname = this.router.url.split('?')[0];
    if (pathname == '/dashboard') {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: parameters,
      });
      setTimeout(() => {
        this.filterGraphData();
      }, 100);
    }
  }

  /*  Lead Filter */
  onChangeLeadFilter(e: any) {
    if (this.filterDropdown != '') {
      this.filterGraphData();
    }
  }

  /*  Lead Show In Graph */
  filterGraphData() {
    this.spinner.show();
    var tokenTemp = localStorage.getItem('token');
    let groupIdParam =
      this.activatedRoute.snapshot.queryParamMap.get('group_id');
    let groupId = groupIdParam ? groupIdParam : 0;
    let parameters = { groupId: groupId, filter: this.filterDropdown };
    this.apiService
      .getGraphData(tokenTemp, parameters)
      .subscribe((response: any) => {
        this.selectedGroup = {
          group_id: groupId,
          count: response.values.reduce((a: any, b: any) => a + b, 0),
        };
        this.dateVariable = '';
        this.data = {
          labels: response.labels,
          datasets: [
            {
              label: 'Leads',
              data: response.values,
              fill: false,
              tension: 0.4,
              borderColor: '#4f70b4',
            },
          ],
        };

        this.spinner.hide();
      });
  }
}
