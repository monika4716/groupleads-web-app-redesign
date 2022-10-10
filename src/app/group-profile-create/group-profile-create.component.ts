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
  groupProfileId: any = '';
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
  topic: any = [];
  files: any = [];
  previewFlag: boolean = true;
  previousImage: any = [];
  removeImage: any = [];

  activeStepIndex: number = 0;
  overViewForm: FormGroup;
  popularTopicForm: FormGroup;
  publishForm: FormGroup;
  topConversationForm: FormGroup;
  uploadedFiles: any[] = [];
  urls = new Array<string>();

  displayPublishModel: boolean = false;
  facebookShare: any = '';
  instagramShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';

  fileList: File[] = [];
  listOfFiles: any[] = [];
  imagePath: any = '';

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
    var token = localStorage.getItem('token');
    this.token = token;
    this.urls = [];
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.groupId = params['group_id'];
      if (params['id']) {
        this.groupProfileId = params['id'];
      }
    });

    this.apiService.getGroupProfile().subscribe((response) => {
      if (
        response.hasOwnProperty('groupProfile') &&
        response.hasOwnProperty('GroupLocations') &&
        response.hasOwnProperty('GroupCategories') &&
        response.hasOwnProperty('path')
      ) {
        this.groupProfile = response.groupProfile;
        this.groupLocations = response.GroupLocations;
        this.groupCategories = response.GroupCategories;
        this.imagePath = response.path;
        console.log(this.groupProfile);
        console.log(this.groupId);
        console.log(this.groupProfileId);
        let found = this.groupProfile.findIndex((value: any) => {
          return value.id == this.groupId;
        });
        console.log(this.groupProfile[found]);
        if (found > -1) {
          this.groupName = this.groupProfile[found].group_name;
          this.fbGroupId = this.groupProfile[found].fb_group_id;
          this.groupDetails = this.groupProfile[found];
          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = false;

            this.setProfileValues();
          }

          let url = '';
          this.setSocialLink(url);
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
      .getParticularGroupProfile(this.groupId, token, this.groupProfileId)
      .subscribe((response: any) => {
        // console.log(response.groupProfileDetail);
        if (response.status == 200) {
          this.groupFlag = true;
          this.imagePath = response.path;
          this.groupLocations = response.GroupLocations;
          this.groupCategories = response.GroupCategories;
          this.groupDetails = response.groupProfileDetail;
          this.fbGroupId = this.groupDetails.fb_group_id;

          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = false;
            this.setProfileValues();
          }

          // console.log(this.groupDetails);

          let url = '';
          this.setSocialLink(url);
        }
        this.spinner.hide();
      });
  }

  setProfileValues() {
    console.log(this.groupDetails);
    console.log(this.imagePath);
    console.log(this.groupLocations);
    console.log(this.groupCategories);
    this.description = this.groupDetails.description;
    this.uniqueName = this.groupDetails.unique_name;

    if (this.groupDetails.topic != '') {
      this.topic = this.groupDetails.topic.split(',');
    }
    console.log(this.groupDetails.images);
    console.log(typeof this.groupDetails.images);
    if (this.groupDetails.images != '') {
      console.log('if');
      this.previousImage = JSON.parse(this.groupDetails.images);
      console.log(this.previousImage);
    }
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

    this.activeStepIndex = 2;
  }

  uploadImages(event: any) {
    console.log(event.target.files);
    this.files = event.target.files;
    console.log(this.files);
    for (var i = 0; i <= this.files.length - 1; i++) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
      };
      reader.readAsDataURL(this.files[i]);

      var selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      this.listOfFiles.push(selectedFile.name);
    }
  }

  removePreviousFile(index: any) {
    console.log(index);
    console.log(this.previousImage);
    this.removeImage.push(this.previousImage[index]);
    console.log(this.removeImage);
    this.previousImage.splice(index, 1);
    console.log(this.removeImage);
    //console.log(this.previousImage);
  }

  // uploadImages2(imageInput: any) {
  //   console.log(imageInput.files);
  //   this.files = imageInput.files;
  //   console.log(this.files);
  //   if (this.files) {
  //     for (let file of this.files) {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.urls.push(e.target.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  removeSelectedFile(index: any) {
    this.urls.splice(index, 1);
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);

    console.log(this.listOfFiles); // name of files
    console.log(this.fileList); //array of files
    console.log(this.urls); // show image encrypt image code
  }

  validateStep3() {
    console.log(this.files);
    this.activeStepIndex = 3;
  }
  validateStep4() {
    this.saveGroupProfile();
    this.displayPublishModel = true;
    // this.activeStepIndex = 1;
  }

  publishLater() {
    this.saveGroupProfile();
  }

  saveGroupProfile() {
    console.log(this.overViewForm);
    console.log(this.popularTopicForm);
    console.log(this.files);
    this.selectedCategory = this.overViewForm.value.category;
    this.description = this.overViewForm.value.description;
    this.selectedLocation = this.overViewForm.value.location;
    this.uniqueName = this.overViewForm.value.uniqueName;

    if (this.popularTopicForm.value.topic.length > 0) {
      this.topic = this.popularTopicForm.value.topic;
    }
    console.log(this.token);
    console.log(typeof this.files);

    const formData: FormData = new FormData();

    formData.append('categoryId', this.selectedCategory);
    formData.append('description', this.description);
    formData.append('locationId', this.selectedLocation);
    formData.append('uniqueName', this.uniqueName);
    formData.append('topic', this.topic);
    formData.append('removeImage', this.removeImage);

    let imagesArray = this.fileList;

    for (let image of imagesArray) {
      formData.append('images[]', image);
    }
    formData.append('group_id', this.groupId);
    formData.append('fb_group_id', this.fbGroupId);
    this.apiService
      .saveGroupProfile(this.token, formData)
      .subscribe((response: any) => {
        console.log(response);

        // if (response.status == 200) {
        //   //show copy profile link popup
        //   this.displayBasic = true;
        //   this.setAdminBioValue(response);
        // }
      });
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

  setSocialLink(url: any) {
    this.facebookShare =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    this.instagramShare = '';
    this.twitterShare =
      'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url);
    this.linkedInShare =
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent(url);
  }
}
