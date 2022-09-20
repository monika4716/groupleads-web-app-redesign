import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';
import sweetAlert from 'sweetalert2';

@Component({
  selector: 'app-group-leads',
  templateUrl: './group-leads.component.html',
  styleUrls: ['./group-leads.component.css'],
})
export class GroupLeadsComponent implements OnInit {
  Nogroupleads: boolean = false;
  id: any = 0;
  filter: any;
  skip: any = 0;
  take: any = 0;
  rowsPerPage: any = 10;
  cols: any[];
  sortField: any = '';
  sortOrder: any;
  first: number = 0;
  totalRecords: any = 0;
  leads: any = [];
  csvName: string = 'Leads';
  listingUpdated: boolean = true;
  groupsTemp: any = [];
  groupsData: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private location: Location,
    private apiService: ApiService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['group_id'];
      this.filter = params['filter_name'];
      if (this.filter == undefined) {
        this.filter = 'All Time';
      }
      this.skip = 0;
      this.take = this.rowsPerPage;
    });

    this.cols = [
      { field: 'profile_url', header: 'Profile Url' },
      { field: 'full_name', header: 'Full Name' },
      { field: 'first_name', header: 'First Name' },
      { field: 'last_name', header: 'Last Name' },
      { field: 'joined_date', header: 'Joined Facebook' },
      { field: 'ques_one', header: 'Question 1' },
      { field: 'ans_one', header: 'Answer 1' },
      { field: 'ques_two', header: 'Question 2' },
      { field: 'ans_two', header: 'Answer 2' },
      { field: 'ques_three', header: 'Question 3' },
      { field: 'ans_three', header: 'Answer 3' },
      { field: 'created_at', header: 'Date Added' },
    ];
  }

  ngOnInit(): void {
    var token = localStorage.getItem('token');
    this.apiService.getGroupOverview().subscribe((response) => {
      console.log(Object.keys(response).length);
      if (response.hasOwnProperty('groupsList') && !this.listingUpdated) {
        this.listingUpdated = true;
        let tempGroups = JSON.parse(JSON.stringify(response.groupsList));
        this.groupsTemp = tempGroups;
        this.groupsData = this.groupsTemp;
        console.log(this.groupsData);
        this.getGroupName();
      } else {
        this.getGroupData();
      }
    });
  }

  lazyLoadLeads(event: any) {
    console.log(event);
    this.skip = event.first;
    this.take = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.getLeadsData();
    console.log('getLeadsData called from lazy load');
  }

  getLeadsData() {
    // this.exportCSV();
    this.spinner.show('sp5');
    let token = localStorage.getItem('token');
    console.log('getLeadsData called');
    let params = {
      skip: this.skip,
      take: this.take,
      group_id: this.id,
      filter: this.filter,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };
    this.apiService.getLeadsData(token, params).subscribe((data: any) => {
      if (data.status == 200) {
        console.log(data.totalRecords);
        if (data.totalRecords != '-1') {
          this.totalRecords = data.totalRecords;
          this.Nogroupleads = false;
        }
        this.leads = data.data;

        if (this.skip == 0) {
          this.first = 0;
        }
        setTimeout(() => {
          this.spinner.hide('sp5');
        }, 500);
      }
    });
  }

  deleteLeads(id: any, index: any) {
    console.log('delete leads', id, index);

    // sweetAlert.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.value) {
    //     this.token = localStorage.getItem("token");
    //     this.apiService.deleteLeads({"id":id},this.token).subscribe((response: any) => {
    //       if (response["status"] == 404) {
    //         this.spinner.hide();

    //       } else if (response["status"] == 200) {
    //         this.leads.splice(index, 1);
    //         sweetAlert.fire(
    //           'Deleted!',
    //           'Your Lead has been deleted.',
    //           'success'
    //         )
    //       }
    //     }, (err) => {
    //       console.log(err);
    //     })
    //   }
    // })
  }

  getGroupData() {
    let token = localStorage.getItem('token');
    this.apiService.getGroupsList(token).subscribe((response: any) => {
      if (response['status'] == 404) {
        this.spinner.hide();
      } else if (response['status'] == 200) {
        console.log(response);
        this.groupsTemp = response.groupList;
        this.groupsData = this.groupsTemp;
        console.log(this.groupsData);
      }
    });
  }

  getGroupName() {}
}
