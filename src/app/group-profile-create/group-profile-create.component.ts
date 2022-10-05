import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { MenuItem, MegaMenuItem } from 'primeng/api';

import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-group-profile-create',
  templateUrl: './group-profile-create.component.html',
  styleUrls: ['./group-profile-create.component.css'],
})
export class GroupProfileCreateComponent implements OnInit {
  token: any;
  groupProfiles: any = [];
  groupId: any;
  fbGroupId: any;
  groupProfile: any = [];
  groupDetails: any;
  groupOverview: any;
  submitted: boolean = false;
  groupFlag: boolean = false;
  items: MenuItem[] = [];

  activeStepIndex: number = 0;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    

    this.items = [{
          label: 'Group Overview',
          command: (event: any) => {
              // this.activeStepIndex = 0;
          }
      },
      {
          label: 'Popular Topics',
          command: (event: any) => {
              // this.activeStepIndex = 1;
          }
      },
      {
          label: 'Top Conversations',
          command: (event: any) => {
              // this.activeStepIndex = 2;
          }
      },
      {
          label: 'Preview & Publish',
          command: (event: any) => {
              // this.activeStepIndex = 3;
          }
      }
    ];

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.groupId = params['group_id'];
      this.fbGroupId = params['fb_group_id'];
    });

    this.apiService.getGroupProfile().subscribe((response) => {
      if (response.hasOwnProperty('groupProfile')) {
        this.groupProfile = response.groupProfile;
        console.log(this.groupProfile);
        console.log(this.groupId);
        console.log(this.fbGroupId);
        let found = this.groupProfile.findIndex((value: any) => {
          return value.id == this.groupId;
        });
        console.log(this.groupProfile[found]);
        if (found > -1) {
          this.groupDetails = this.groupProfile[found];
        }
        console.log(this.groupProfile[found]);
      } else {
        console.log(response);

        this.getGroupDetails();
      }
    });
  }

  getGroupDetails() {
    this.spinner.show();
    var token = localStorage.getItem('token');
    this.apiService
      .getParticularGroupProfile(this.groupId, token, this.fbGroupId)
      .subscribe((response: any) => {
        console.log(response.groupProfileDetail);

        if (response.status == 200) {
          this.groupFlag = true;
          this.groupDetails = response.groupProfileDetail;
          console.log(this.groupDetails);
        }
        this.spinner.hide();
      });
  }

  validateStep1() {
    //logic perform

    this.activeStepIndex = 1;

  }
  validateStep2() {

    this.activeStepIndex = 2;

  }
  validateStep3() {

    this.activeStepIndex = 3;

  }
  validateStep4() {

    alert("Form submitted")
    // this.activeStepIndex = 1;

  }


  backToStepIndex(stepIndex:any){
    this.activeStepIndex = stepIndex;
  }


}
