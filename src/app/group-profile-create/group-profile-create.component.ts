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
import { group } from '@angular/animations';
import { ConditionalExpr, splitNsName } from '@angular/compiler';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-group-profile-create',
  templateUrl: './group-profile-create.component.html',
  styleUrls: ['./group-profile-create.component.css'],
})
export class GroupProfileCreateComponent implements OnInit {
  token: any;
  groupProfiles: any = [];
  groupId: any;
  profileSlug: any;
  dynamicGroupUrl: any;
  fbGroupId: any;
  groupProfileId: any = 0;
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
  msgs: any;

  activeStepIndex: number = 0;
  overViewForm: FormGroup;
  popularTopicForm: FormGroup;
  publishForm: FormGroup;
  topConversationForm: FormGroup;
  uploadedFiles: any[] = [];
  conversationImagesCode = new Array<string>();

  displayPublishModel: boolean = false;
  facebookShare: any = '';
  instagramShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';

  fileList: File[] = [];
  imagePath: any = '';
  slug: any = '';
  origin: any = '';
  href: any = '';
  displayForm: boolean = true;
  displaycloseButton: boolean = false;
  displayIframe: boolean = false;
  iframeUrl: any = '';
  status: any = 0;
  conversationImageUrl: any = '';
  adminImageUrl: any = '';
  conversationImages: any = [];
  user: any = [];
  adminBio: any = [];
  linkedFbGroup: any = [];
  uploadUrls: any = [];
  groupImageUrl: any = '';
  groupReviews: any = [];
  manageProfileStorage: any = {};
  publishGroup: any = {};
  publishimages: any = [];
  image: any = {};
  isCopyDisable: boolean = false;
  conversationBaseCode: any = [];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private clipboardService: ClipboardService
  ) {
    var token = localStorage.getItem('token');
    this.origin = location.origin;
    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.activatedRoute.queryParams.subscribe((params) => {
      this.groupId = params['group_id'];
      if (params['id']) {
        this.groupProfileId = params['id'];
      }
    });
    this.overViewForm = this.fb.group({
      description: [
        '',
        [Validators.required, Validators.pattern('(?! ).*[^ ]')],
      ],
      category: ['', Validators.required],
      location: ['', Validators.required],
      uniqueName: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
          asyncValidators: [
            this.apiService.GroupUniqueNameExistsValidator(
              token,
              this.uniqueName,
              this.groupProfileId
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
    this.href = this.router.url;
    this.getGroupDetails();
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

    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    this.dynamicGroupUrl = '/group-profile/';
    if (pathnamArray.length > 2) {
      this.dynamicGroupUrl = '/' + pathnamArray[1] + '/group-profile/';
    }

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
          this.previousImage = response.profileImages;
        }
      });
  }

  getGroupDetails() {
    this.spinner.show();
    var token = localStorage.getItem('token');
    this.apiService
      .getParticularGroupProfile(this.groupId, token, this.groupProfileId)
      .subscribe((response: any) => {
        if (response.status == 200) {
          localStorage.setItem(
            'manageProfileStorage',
            JSON.stringify(response)
          );
          let groupDetails = response.groupDetails;
          this.conversationImageUrl = response.conversationImageURl;
          if (groupDetails.admin_bio != undefined) {
            this.adminBio = groupDetails.admin_bio[0];
          }
          this.adminImageUrl = response.adminImageUrl;
          if (groupDetails.user != undefined) {
            this.user = groupDetails.user[0];
          }

          this.groupImageUrl = response.groupImageUrl;
          if (groupDetails.linked_fb_group != undefined) {
            this.linkedFbGroup = groupDetails.linked_fb_group;
          }
          this.groupReviews = groupDetails.group_reviews;
          this.groupCategories = response.groupCategories;

          if (groupDetails.linked_fb_group != undefined) {
            this.linkedFbGroup = groupDetails.linked_fb_group;
            this.fbGroupId = this.linkedFbGroup.fb_group_id;
            this.groupName = this.linkedFbGroup.group_name;
          } else {
            this.groupName = groupDetails.group_name;
            this.fbGroupId = groupDetails.fb_group_id;
          }

          if (groupDetails.description) {
            this.description = groupDetails.description;
          }
          if (groupDetails.category_id) {
            this.selectedCategory = groupDetails.category_id;
          }
          if (groupDetails.location_id) {
            this.selectedLocation = groupDetails.location_id;
          }
          if (groupDetails.unique_name) {
            this.uniqueName = groupDetails.unique_name;
            this.profileSlug =
              this.origin + this.dynamicGroupUrl + this.uniqueName;
          }
          if (groupDetails.topic) {
            this.topic = groupDetails.topic.split(',');
          }
          if (groupDetails.group_profile_id != null) {
            this.previewFlag = true;
            this.setProfileValues();
          }
          if (
            groupDetails.group_conversation_images != undefined &&
            groupDetails.group_conversation_images.length > 0
          ) {
            this.conversationImages = groupDetails.group_conversation_images;
            this.showConversationImages();
          }
          this.setSocialLink();
        }
        this.spinner.hide();
      });
  }

  showConversationImages() {
    for (var i = 0; i <= this.conversationImages.length - 1; i++) {
      let id = this.conversationImages[i].id;
      let image = this.conversationImageUrl + this.conversationImages[i].image;
      this.uploadUrls.push({ id: id, image: image });
    }
  }
  setProfileValues() {
    this.description = this.groupDetails.description;
    this.uniqueName = this.groupDetails.unique_name;
    this.profileSlug = this.origin + this.dynamicGroupUrl + this.uniqueName;
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
    return this.overViewForm.controls;
  }

  validateStep1() {
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
      this.profileSlug = this.origin + this.dynamicGroupUrl + this.uniqueName;
      this.setSocialLink();
    }
    this.activeStepIndex = 1;
    // set the updated value in manageProfileStorage storage //
    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
    if (
      this.manageProfileStorage != null &&
      this.manageProfileStorage != undefined
    ) {
      this.manageProfileStorage.groupDetails.description = this.description;
      this.manageProfileStorage.groupDetails.category_id = parseInt(
        this.selectedCategory
      );
      this.manageProfileStorage.groupDetails.location_id =
        this.selectedLocation;
      if (this.groupProfileId == 0 || this.status == 0) {
        this.manageProfileStorage.groupDetails.unique_name = this.uniqueName;
        this.manageProfileStorage.isShareShow = false;
      }
      localStorage.setItem(
        'manageProfileStorage',
        JSON.stringify(this.manageProfileStorage)
      );
    }
    // end  the updated value in manageProfileStorage storage //
  }
  validateStep2() {
    this.activeStepIndex = 2;
    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
    this.manageProfileStorage.groupDetails.is_topics = true;
    this.manageProfileStorage.groupDetails.topic =
      this.popularTopicForm.value.topic;
    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );
  }

  uploadImages(event: any) {
    this.files = event.target.files;
    for (var i = 0; i <= this.files.length - 1; i++) {
      let Imagesize = 5000000;
      if (Imagesize <= this.files[i].size) {
        this.msgs = [
          {
            severity: 'warn',
            summary: 'Warning',
            detail: 'Image size should be less than 5 Mb ',
          },
        ];
      } else if (
        this.files[i].type != 'image/jpeg' &&
        this.files[i].type != 'image/png' &&
        this.files[i].type != 'image/jpg'
      ) {
        this.msgs = [
          {
            severity: 'warn',
            summary: 'Warning',
            detail: 'Image type should be ( jpeg | jpg | png ) ',
          },
        ];
      } else {
        let objectURL = URL.createObjectURL(event.target.files[i]);
        let id = Math.floor(10000 + Math.random() * 90000);
        this.uploadUrls.push({
          id: id,
          image: objectURL,
          name: event.target.files[i].name,
        });
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.conversationImagesCode.push(e.target.result);
        };
        reader.readAsDataURL(this.files[i]);
        var selectedFile = event.target.files[i];
        this.fileList.push(selectedFile);
      }
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }
  removePreviousFile(i: any, id: any) {
    let uploadUrlIndex = this.uploadUrls.findIndex((x: any) => x.id == id);
    let fileListIndex = this.fileList.findIndex(
      (x: any) => x.name == this.uploadUrls[uploadUrlIndex].name
    );
    //CREATE PERVIOUS IMAGES ARRAY TO REMOVE IMAGES FROM DATABASE
    if (
      this.uploadUrls[uploadUrlIndex].image.indexOf('/conversationImages/') > 0
    ) {
      let imageArray = this.uploadUrls[uploadUrlIndex].image.split(
        '/conversationImages/'
      );
      this.image.id = id;
      this.image.image = imageArray[1];
      this.removeImage.push(this.image);
    }
    this.uploadUrls.splice(uploadUrlIndex, 1);
    if (fileListIndex >= 0) {
      this.fileList.splice(fileListIndex, 1);
    }
  }

  validateStep3() {
    this.activeStepIndex = 3;
    this.manageProfileStorage.groupDetails.group_conversation_images =
      this.uploadUrls;
    this.manageProfileStorage.groupDetails.is_conversations = true;
    this.manageProfileStorage.groupDetails.group_reviews = [];
    this.manageProfileStorage.groupDetails.image = '';
    this.manageProfileStorage.groupDetails.conversationImagesCode =
      this.conversationImagesCode;
    this.manageProfileStorage.groupDetails.created_at = new Date();
    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );
  }
  validateStep4() {
    let publish = true;
    this.status = 1;
    this.saveGroupProfile(publish);
  }

  publishLater() {
    let publish = false;
    this.status = 0;
    this.saveGroupProfile(publish);
  }

  saveGroupProfile(publish: any) {
    this.selectedCategory = this.overViewForm.value.category;
    this.description = this.overViewForm.value.description;
    this.selectedLocation = this.overViewForm.value.location;
    this.uniqueName = this.overViewForm.value.uniqueName;
    if (this.popularTopicForm.value.topic.length > 0) {
      this.topic = this.popularTopicForm.value.topic;
    }
    const formData: FormData = new FormData();
    formData.append('categoryId', this.selectedCategory);
    formData.append('description', this.description);
    formData.append('locationId', this.selectedLocation);
    formData.append('uniqueName', this.uniqueName);
    formData.append('topic', this.topic);
    formData.append('removeImage', JSON.stringify(this.removeImage));
    formData.append('profile_id', this.groupProfileId);
    formData.append('status', this.status);

    let imagesArray = this.fileList;
    for (let image of imagesArray) {
      formData.append('images[]', image);
    }
    formData.append('group_id', this.groupId);
    formData.append('fb_group_id', this.fbGroupId);
    this.apiService
      .saveGroupProfile(this.token, formData)
      .subscribe((response: any) => {
        this.apiService.updateGroupProfile(response);

        if (response.status == 200) {
          if (publish) {
            this.displayPublishModel = true;
          } else {
            setTimeout(() => {
              this.router.navigate(['/group-profiles']);
            }, 100);
          }
        }
      });
  }

  backToStepIndex(stepIndex: any) {
    this.activeStepIndex = stepIndex;
  }
  onChangeCategory(e: any) {
    this.selectedCategory = e.value;
  }

  onChangeLocation(e: any) {
    this.selectedLocation = e.value;
  }

  setSocialLink() {
    let url = this.origin + this.dynamicGroupUrl + this.uniqueName;
    this.facebookShare =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    this.instagramShare = '';
    this.twitterShare =
      'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url);
    this.linkedInShare =
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent(url);
  }

  copyGroupProfileModel(uniqueName: any) {
    this.profileSlug = this.origin + this.dynamicGroupUrl + this.uniqueName;
    this.model_text = 'Copied';
    // this.clipboardService.copy(this.profileSlug);
    var textField = document.createElement('textarea');
    textField.innerText = this.profileSlug;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    console.log('should have copied ' + this.profileSlug);
    setTimeout(() => {
      this.model_text = 'Copy';
    }, 2000);
  }

  /* OPEN ADMIN BIO PREVIEW */
  openPreview() {
    this.setPublishGroupStorage();
    let url = new URL(window.location.href);
    let urlPreview =
      url.origin +
      this.dynamicGroupUrl +
      this.uniqueName +
      '?displayClose=true&preview=true&manage=false';
    this.displayForm = false;
    this.displaycloseButton = true;
    this.displayIframe = true;
    this.iframeUrl = urlPreview;
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

  setPublishGroupStorage() {
    let status: any = 1;
    let imagesArray = this.fileList;
    for (let image of imagesArray) {
      this.publishimages.push(image);
      const reader = new FileReader();
      if (image) {
        reader.readAsDataURL(image);
        reader.onload = () => {
          this.conversationBaseCode.push(reader.result);
        };
      }
    }
    // create storage to publish form from preview publish button
    this.publishGroup.categoryId = this.selectedCategory;
    this.publishGroup.description = this.description;
    this.publishGroup.locationId = this.selectedLocation;
    this.publishGroup.uniqueName = this.uniqueName;
    this.publishGroup.topic = this.topic;
    this.publishGroup.removeImage = JSON.stringify(this.removeImage);
    this.publishGroup.profile_id = this.groupProfileId;
    this.publishGroup.group_id = this.groupId;
    this.publishGroup.fb_group_id = this.fbGroupId;
    this.publishGroup.isReview = 0;
    this.publishGroup.isTopic = 0;
    this.publishGroup.isConversations = 0;
    localStorage.setItem('publishGroup', JSON.stringify(this.publishGroup));
    //end
  }

  closePublishModel() {
    setTimeout(() => {
      this.router.navigate(['/group-profiles']);
    }, 500);
  }

  createUniqueGroupSlug(x: any) {
    //remove special char num and change space into hyphen//
    this.uniqueName = x.target.value
      .replace(/^\d+|[\W_]?/, '')
      .replace(/[^a-zA-Z- ]/g, '')
      .replace(/\s/g, '-')
      .replace(/[-]+/g, '-')
      .toLowerCase();
    x.target.value = this.uniqueName;
  }

  removeDescriptionSpace(e: any) {
    this.description = e.target.value.replace(/^\d+|[\W_]?/, '');
    e.target.value = this.description;
  }
}
