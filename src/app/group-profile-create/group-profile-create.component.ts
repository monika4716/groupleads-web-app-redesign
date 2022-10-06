import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import * as $ from 'jquery';
// import { MenuItem, MegaMenuItem } from 'primeng/api';

import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

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
  groupName: any;
  groupLocations: any = [];
  groupCategories: any = [];
  selectedCategory: any = 1;
  selectedLocation: any = 1;
  uniqueName: any;
  description: any;
  topic: string[] = [];
  files: any = [];
  previewFlag: boolean = true;

  activeStepIndex: number = 0;
  overViewForm: FormGroup;
  popularTopicForm: FormGroup;
  publishForm: FormGroup;
  topConversationForm: FormGroup;
  uploadedFiles: any[] = [];
  urls = new Array<string>();

  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.overViewForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      uniqueName: ['', Validators.required],
    });

    this.popularTopicForm = this.fb.group({
      topic: [''],
    });
    this.topConversationForm = this.fb.group({
      conversation: [''],
    });

    this.publishForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.urls = [];
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.groupId = params['group_id'];
      this.fbGroupId = params['fb_group_id'];
    });

    this.apiService.getGroupProfile().subscribe((response) => {
      if (
        response.hasOwnProperty('groupProfile') &&
        response.hasOwnProperty('GroupLocations') &&
        response.hasOwnProperty('GroupCategories')
      ) {
        this.groupProfile = response.groupProfile;
        this.groupLocations = response.GroupLocations;
        this.groupCategories = response.GroupCategories;
        console.log(this.groupProfile);
        console.log(this.groupId);
        console.log(this.fbGroupId);
        let found = this.groupProfile.findIndex((value: any) => {
          return value.id == this.groupId;
        });
        console.log(this.groupProfile[found]);
        if (found > -1) {
          this.groupDetails = this.groupProfile[found];
          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = false;
          }
          this.groupName = this.groupProfile[found].group_name;
        }

        console.log(this.groupProfile[found]);
      } else {
        //console.log(response);
        this.getGroupDetails();
      }
    });

    this.items = [
      {
        label: 'Group Overview',
        command: (event: any) => {
          // this.activeStepIndex = 0;
        },
      },
      {
        label: 'Popular Topics',
        command: (event: any) => {
          // this.activeStepIndex = 1;
        },
      },
      {
        label: 'Top Conversations',
        command: (event: any) => {
          // this.activeStepIndex = 2;
        },
      },
      {
        label: 'Preview & Publish',
        command: (event: any) => {
          // this.activeStepIndex = 3;
        },
      },
    ];
  }

  getGroupDetails() {
    this.spinner.show();
    var token = localStorage.getItem('token');
    this.apiService
      .getParticularGroupProfile(this.groupId, token, this.fbGroupId)
      .subscribe((response: any) => {
        // console.log(response.groupProfileDetail);
        if (response.status == 200) {
          this.groupFlag = true;
          this.groupDetails = response.groupProfileDetail;
          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = false;
          }
          this.groupLocations = response.GroupLocations;
          this.groupCategories = response.GroupCategories;
          // console.log(this.groupDetails);
        }
        this.spinner.hide();
      });
  }

  get o() {
    //console.log(this.overViewForm.controls);
    return this.overViewForm.controls;
  }

  validateStep1() {
    //logic perform
    console.log(this.overViewForm);

    if (this.overViewForm.value.location != undefined) {
      this.selectedLocation = this.overViewForm.value.location;
    }
    if (this.overViewForm.value.category != undefined) {
      this.selectedCategory = this.overViewForm.value.category;
    }
    if (this.overViewForm.value.description != undefined) {
      this.description = this.overViewForm.value.description;
    }
    if (this.overViewForm.value.uniqueName != undefined) {
      this.uniqueName = this.overViewForm.value.uniqueName;
    }

    console.log(this.selectedLocation);
    console.log(this.selectedCategory);
    console.log(this.description);
    console.log(this.uniqueName);

    this.activeStepIndex = 1;
  }
  validateStep2() {
    console.log(this.popularTopicForm);
    if (this.popularTopicForm.value.topic.length > 0) {
      this.topic = this.popularTopicForm.value.topic;
    }
    console.log(this.topic);
    this.activeStepIndex = 2;
  }

  uploadImages(imageInput: any) {
    console.log(imageInput.files);
    this.files = imageInput.files;
    console.log(this.files);
    if (this.files) {
      for (let file of this.files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  validateStep3() {
    console.log(this.files);
    this.activeStepIndex = 3;
  }
  validateStep4() {
    alert('Form submitted');
    // this.activeStepIndex = 1;
  }

  backToStepIndex(stepIndex: any) {
    this.activeStepIndex = stepIndex;
  }
  onChangeCategory(e: any) {
    console.log(e);
    this.selectedCategory = e.value;
    console.log(this.selectedCategory);
  }

  onChangeLocation(e: any) {
    console.log(e);
    this.selectedLocation = e.value;
    console.log(this.selectedLocation);
  }
}
