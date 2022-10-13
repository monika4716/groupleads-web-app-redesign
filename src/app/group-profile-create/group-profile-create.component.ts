import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { countriesObject } from '../../assets/json/countries';
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
  model_text: any = 'Copy';

  items: MenuItem[] = [];
  groupName: any;
  public groupLocations: any = countriesObject;
  groupCategories: any = [];
  selectedCategory: any = 1;
  selectedLocation: any = 'AF';
  uniqueName: any;
  description: any;
  topic: any = [];
  files: any = [];
  previewFlag: boolean = false;
  previousImage: any = [];
  removeImage: any = [];
  showAddProfileBtn: boolean = true;

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
  slug: any = '';
  origin: any = '';
  href: any = '';
  displayForm: boolean = true;
  displaycloseButton: boolean = false;
  displayIframe: boolean = false;
  iframeUrl: any = '';
  isPublish: any = 0;
  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    var token = localStorage.getItem('token');
    this.origin = location.origin;
    this.overViewForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      uniqueName: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5)],
          asyncValidators: [
            this.apiService.GroupUniqueNameExistsValidator(
              token,
              this.uniqueName
            ),
          ],
          updateOn: 'blur',
        },
      ],
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
    this.href = this.router.url;
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.groupId = params['group_id'];
      if (params['id']) {
        this.groupProfileId = params['id'];
      }
    });

    this.apiService.getGroupProfile().subscribe((response) => {
      console.log(response);
      if (
        response.hasOwnProperty('groupProfile') &&
        response.hasOwnProperty('GroupCategories') &&
        response.hasOwnProperty('path')
      ) {
        this.groupProfile = response.groupProfile;
        this.groupCategories = response.GroupCategories;
        this.imagePath = response.path;
        let found = this.groupProfile.findIndex((value: any) => {
          return value.id == this.groupId;
        });

        if (found > -1) {
          this.groupName = this.groupProfile[found].group_name;
          console.log(this.groupName);
          this.fbGroupId = this.groupProfile[found].fb_group_id;
          this.groupDetails = this.groupProfile[found];
          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = true;
            this.setProfileValues();
          }
          let url = '';
          this.setSocialLink(url);
        }

        console.log(this.groupProfile[found]);

        if (this.groupProfileId != '') {
          this.getProfileImages();
        }
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

    if (this.href.indexOf('/group-profile') > -1) {
      setTimeout(() => {
        $('.group-profiles-list').find('a').addClass('active');
      }, 500);
    }
  }

  getProfileImages() {
    var token = localStorage.getItem('token');
    this.apiService
      .getGProfileImages(token, this.groupProfileId)
      .subscribe((response: any) => {
        if (response.status == 200) {
          console.log(response.profileImages);
          this.previousImage = response.profileImages;
          console.log(this.previousImage);
        }
      });
  }

  getGroupDetails() {
    this.spinner.show();
    var token = localStorage.getItem('token');
    this.apiService
      .getParticularGroupProfile(this.groupId, token, this.groupProfileId)
      .subscribe((response: any) => {
        // console.log(response.groupProfileDetail);
        if (response.status == 200) {
          this.imagePath = response.path;
          this.groupCategories = response.GroupCategories;
          this.groupDetails = response.groupProfileDetail;
          this.fbGroupId = this.groupDetails.fb_group_id;
          this.previousImage = response.profileImages;

          this.groupName = this.groupDetails.group_name;

          if (this.groupDetails.group_profile_id != null) {
            this.previewFlag = true;
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
    console.log(this.groupCategories);
    this.description = this.groupDetails.description;
    this.uniqueName = this.groupDetails.unique_name;
    this.slug = this.groupDetails.unique_name.toLowerCase();
    this.groupName = this.groupDetails.group_name;
    this.showAddProfileBtn = false;
    if (this.groupDetails.topic != '') {
      this.topic = this.groupDetails.topic.split(',');
    }
    this.selectedCategory = this.groupDetails.category_id;
    this.selectedLocation = this.groupDetails.location_id;
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
      console.log(this.selectedLocation);
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
    this.activeStepIndex = 1;
  }
  validateStep2() {
    console.log(this.popularTopicForm);
    this.activeStepIndex = 2;
  }

  uploadImages(event: any) {
    console.log(event.target.files);
    this.files = event.target.files;
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
    this.removeImage.push(this.previousImage[index]);
    this.previousImage.splice(index, 1);
  }

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
    let publish = true;
    this.isPublish = 1;
    this.saveGroupProfile(publish);
  }

  publishLater() {
    let publish = false;
    this.isPublish = 0;
    this.saveGroupProfile(publish);
  }

  saveGroupProfile(publish: any) {
    console.log(publish);
    this.selectedCategory = this.overViewForm.value.category;
    this.description = this.overViewForm.value.description;
    this.selectedLocation = this.overViewForm.value.location;
    this.uniqueName = this.overViewForm.value.uniqueName;
    if (this.popularTopicForm.value.topic.length > 0) {
      this.topic = this.popularTopicForm.value.topic;
    }

    console.log(this.selectedLocation);
    const formData: FormData = new FormData();
    formData.append('categoryId', this.selectedCategory);
    formData.append('description', this.description);
    formData.append('locationId', this.selectedLocation);
    formData.append('uniqueName', this.uniqueName);
    formData.append('topic', this.topic);
    formData.append('removeImage', JSON.stringify(this.removeImage));
    formData.append('profile_id', this.groupProfileId);
    formData.append('isPublish', this.isPublish);

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
        if (response.status == 200) {
          if (publish) {
            this.displayPublishModel = true;
          }
          //show copy profile link popup
          // this.displayBasic = true;
          // this.setAdminBioValue(response);
        }
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

  setSocialLink(link: any) {
    let url = this.origin + '/group-profile/' + this.slug;
    this.facebookShare =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    this.instagramShare = '';
    this.twitterShare =
      'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url);
    this.linkedInShare =
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent(url);
  }

  copyGroupProfileModel(slug: any) {
    let profileSlug = this.origin + '/group-profile/' + slug;
    this.model_text = 'Copied';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileSlug).then(
        () => {
          //alert("Copied to Clipboard");
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('Browser do not support Clipboard API');
    }
    setTimeout(() => {
      this.model_text = 'Copy';
    }, 2000);
  }

  /* OPEN ADMIN BIO PREVIEW */
  openPreview() {
    let url =
      this.origin + '/group-profile/' + this.slug + '?displayClose=true';
    console.log(url);
    this.displayForm = false;
    this.displaycloseButton = true;
    this.displayIframe = true;
    this.iframeUrl = url;
    this.getIframPreview();
    $('.preview_btn').prop('disabled', false);
    $('.share_btn').prop('disabled', false);
  }

  /* GET IFRAME PREVIEW */
  getIframPreview() {
    let setDefaultSetting = setInterval(() => {
      let iframe = document.getElementById('openIframe');
      if (iframe == null) {
        clearInterval(setDefaultSetting);
        this.displayForm = true;
        this.displayIframe = false;
      }
    }, 100);
  }
}
