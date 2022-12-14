import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-group-profile-preview',
  templateUrl: './group-profile-preview.component.html',
  styleUrls: ['./group-profile-preview.component.css'],
})
export class GroupProfilePreviewComponent implements OnInit {
  msgs: any;
  origin: any;
  uniqueName: any;
  groupName: any = '';
  public locationList: any = countriesObject;
  location: any = '';
  category: any = '';
  createdProfile: any = new Date();
  about: any = '';
  public isSeeMore: boolean = true;
  topics: any = [];
  reviews: any = [];
  conversations: any = [];
  conversationFile: any = [];
  conversationFileList: any = [];
  user: any;
  adminName: any = '';
  adminlocation: any = '';
  countryFlag: any = '';
  adminImage: any = 'assets/images/default.jpg';
  adminSlug: any = '';
  showAdminBio: boolean = false;
  facebookGroupLink: any = '';
  facebookShare: any = '';
  instagramShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';
  model_text: any = 'Copy';
  groupImage: any = 'assets/images/profile_banner.png';
  previewEnable: boolean = false;
  manageProfileStorage: any;
  selectedLocation: any = 0;
  selectedCategory: any = 0;
  conversationsImage: any = [];
  adminImageUrl: any = '';
  groupImageUrl: any = '';
  conversationImageUrl: any = '';
  averageRating: any = 0;
  editReviewsForm: FormGroup;
  rating: any = 0;
  review: any = '';
  editReviewSettingForm: FormGroup;
  isReview: boolean = true;
  isTopic: boolean = true;
  isConversations: boolean = true;
  disableWriteReviewBtn: boolean = true;
  status: any = 0;
  token: any;
  publishGroup: any = {};
  adminDetails: any = {};
  displayPublishModel: boolean = false;
  isShareShow: boolean = true;
  showPublishButton: boolean = true;
  id: any = '';
  group_id: any = '';
  reviewImageUrl: any = '';
  reviewImagesUrl: any = '';
  reviewImage: any = '';
  showLessMore: boolean = false;
  adminFacebookId: any = '';
  facebookUrl: any = '';
  groupFile: any = [];
  conversationNum: any = 3;
  publishButtonText: any = 'Publish Profile';
  profileUrl: any = '';
  reviewbutton: any = 'Leave Review';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private fb: FormBuilder,
    private clipboardService: ClipboardService
  ) {
    this.editReviewsForm = this.fb.group({
      profileId: ['', Validators.required],
      groupId: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('(?! ).*[^ ]')]],
      rating: ['', Validators.required],
      review: ['', Validators.required],
    });
    this.editReviewSettingForm = this.fb.group({
      isReview: [''],
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.origin = location.origin;
    this.previewEnable = this.activatedRoute.snapshot.queryParams['preview'];
    if (this.previewEnable != undefined && this.previewEnable) {
      //get Image (binary data for upload in database)
      setTimeout(() => {
        // all a tag not clickable on preview page
        $('a').addClass('clickDisable');
      }, 500);
      this.disableWriteReviewBtn = true;
      this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
      this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
      if (
        this.manageProfileStorage.groupDetails.baseCodeimage != undefined &&
        this.manageProfileStorage.groupDetails.baseCodeimage != ''
      ) {
        let blob = this.b64toBlob(
          this.manageProfileStorage.groupDetails.baseCodeimage
        );
        this.groupFile = new File(
          [blob],
          this.manageProfileStorage.groupDetails.uploadImageName,
          {
            type: 'image/jpeg',
          }
        );
      }
      if (
        this.manageProfileStorage.groupDetails.conversationImagesCode !=
          undefined &&
        this.manageProfileStorage.groupDetails.conversationImagesCode.length > 0
      ) {
        let conversationsBaseCode =
          this.manageProfileStorage.groupDetails.conversationImagesCode;
        conversationsBaseCode;

        for (var i = 0; i <= conversationsBaseCode.length - 1; i++) {
          let blob = this.b64toBlob(conversationsBaseCode[i]);
          this.conversationFile = new File([blob], 'conversation.png', {
            type: 'image/jpeg',
          });
          this.conversationFileList.push(this.conversationFile);
        }
      }
      this.showPreviewDetails(this.manageProfileStorage);
    } else {
      this.spinner.show();
      this.uniqueName = this.activatedRoute.snapshot.paramMap.get('slug');
      this.showPublishButton = false;
      if (this.token == null || this.token == undefined) {
        this.disableWriteReviewBtn = false;
      }
      this.getGroupProfilePreview();
    }
  }
  //  converert image base code to blob

  b64toBlob(dataURI: any) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }
  //SHOW PREVIEW DETAILS
  showPreviewDetails(response: any) {
    this.adminImageUrl = response.adminImageUrl;
    this.reviewImagesUrl = response.reviewImageUrl;
    this.conversationImageUrl = response.conversationImageURl;
    this.groupImageUrl = response.groupImageUrl;
    let groupCategories = response.groupCategories;
    let groupDetails = response.groupDetails;
    if (groupDetails.admin_bio) {
      this.adminDetails = groupDetails.admin_bio[0];
    }
    if (groupDetails.user) {
      this.user = groupDetails.user[0];
    }
    let linkedDetails = groupDetails.linked_fb_group;
    this.conversations = groupDetails.group_conversation_images;
    this.id = groupDetails.id;
    this.group_id = groupDetails.linked_group_id;

    if (linkedDetails != undefined) {
      this.groupName = linkedDetails.group_name;
      this.facebookGroupLink =
        'https://www.facebook.com/groups/' + linkedDetails.fb_group_id;
      this.createdProfile = groupDetails.created_at;
    } else {
      this.groupName = groupDetails.group_name;
      this.facebookGroupLink =
        'https://www.facebook.com/groups/' + groupDetails.fb_group_id;
    }
    this.isReview = groupDetails.is_reviews;
    if (groupDetails.is_reviews == 0) {
      this.isReview = false;
    } else if (groupDetails.is_reviews == 1) {
      this.isReview = true;
    }
    this.isTopic = groupDetails.is_topics;
    if (groupDetails.is_topics == 0) {
      this.isTopic = false;
    } else if (groupDetails.is_topics == 1) {
      this.isTopic = true;
    }

    this.isConversations = groupDetails.is_conversations;
    if (groupDetails.is_conversations == 0) {
      this.isConversations = false;
    } else if (groupDetails.is_conversations == 1) {
      this.isConversations = true;
    }

    this.selectedLocation = groupDetails.location_id;
    this.selectedCategory = groupDetails.category_id;
    this.setCategoryName(this.selectedCategory, groupCategories);
    this.setLocationValue(this.selectedLocation);

    this.about = groupDetails.description;

    if (groupDetails.description.length > 350) {
      this.showLessMore = true;
    }
    this.topics = groupDetails.topic;
    this.uniqueName = groupDetails.unique_name;
    if (
      this.topics != null &&
      !Array.isArray(this.topics) &&
      this.topics.length > 0
    ) {
      if (this.topics.indexOf(',') > 0) {
        this.topics = this.topics.split(',');
      } else {
        this.topics = this.topics.split(' ');
      }
    } else {
      this.topics = [];
    }
    this.showConversationImage();
    if (this.conversationsImage.length == 0) {
      this.conversationsImage = this.conversations;
    }
    if (groupDetails.image != '' && groupDetails.image != undefined) {
      this.groupImage = groupDetails.image;
      if (this.groupImage.indexOf('/') < 0) {
        this.groupImage = this.groupImageUrl + '/' + groupDetails.image;
      }
    }
    this.showAdmins(this.adminDetails);
    this.setSocialLink();
    if (
      groupDetails.group_reviews != undefined &&
      groupDetails.group_reviews != null
    ) {
      this.reviews = groupDetails.group_reviews;
      this.averageRating = this.calculateAverageReview();
    }
    if (response.isShareShow != undefined && response.isShareShow != null) {
      this.isShareShow = response.isShareShow;
    }
    this.spinner.hide();
  }
  //SHOW CONVERSATION IMAGES
  showConversationImage() {
    this.conversationsImage = [];
    this.conversationNum = this.conversations.length;
    if (this.conversationNum >= 3) {
      this.conversationNum = 3;
    }
    for (let i = 0; i < this.conversations.length; i++) {
      if (this.conversations[i].image) {
        if (this.conversations[i].image.indexOf('http') < 0) {
          let image =
            this.conversationImageUrl + '/' + this.conversations[i].image;
          this.conversationsImage.push(image);
        } else {
          let image = this.conversations[i].image;
          this.conversationsImage.push(image);
        }
      }
    }
  }
  // GET AVERAGE REVIEW
  calculateAverageReview() {
    let totalRating = this.reviews.length * 5;
    let maxNumberOfStars = 0;
    for (let i = 0; i < this.reviews.length; i++) {
      maxNumberOfStars = parseInt(this.reviews[i].rating) + maxNumberOfStars;
    }
    let likePercentageStars = Math.round((5 / totalRating) * maxNumberOfStars);
    return likePercentageStars;
  }
  // EDIT REVIEWS
  editReviews() {
    this.reviewbutton = 'Processing...';
    this.rating = this.editReviewsForm.value.rating;
    this.review = this.editReviewsForm.value.review;

    this.saveReviews(this.editReviewsForm);
    // setTimeout(() => {
    //   $('#editReviews_close').click();
    //   this.editReviewsForm.controls['name'].reset();
    //   this.editReviewsForm.controls['review'].reset();
    //   this.editReviewsForm.controls['rating'].reset();
    //   $('#review-image-show').attr('src', '');
    // }, 4000);
  }
  //EDIT REVIEW SETTING
  saveReviews(reviewsForm: any) {
    const formData: FormData = new FormData();
    formData.append('name', reviewsForm.value.name);
    formData.append('image', this.reviewImage);
    formData.append('rating', reviewsForm.value.rating);
    formData.append('review', reviewsForm.value.review);
    formData.append('groupProfileId', reviewsForm.value.profileId);
    formData.append('groupId', reviewsForm.value.groupId);
    this.apiService.saveReview(formData).subscribe((response: any) => {
      this.showPreviewDetails(response);
      this.reviewbutton = 'Leave Review';
      setTimeout(() => {
        $('#editReviews_close').click();
        reviewsForm.controls['name'].reset();
        reviewsForm.controls['review'].reset();
        reviewsForm.controls['rating'].reset();
        $('#review-image-show').attr('src', '');
      }, 2000);

      if (response.status == 200) {
        this.msgs = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Review Submitted Successfully',
          },
        ];
      } else {
        this.msgs = [
          {
            severity: 'warn',
            summary: 'Warning',
            detail: 'Review Not Submited',
          },
        ];
      }
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  editReviewSetting() {
    this.isReview = this.editReviewSettingForm.value.isReview;
  }

  get r() {
    return this.editReviewsForm.controls;
  }
  // GET DETAILS BY SLUG AND SHOW PREVIEW
  getGroupProfilePreview() {
    this.apiService
      .getGroupProfilePreview(this.uniqueName)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.showPreviewDetails(response);
        }
      });
  }

  //SET LOCATION VALUE

  setLocationValue(location: any) {
    let index = this.locationList.findIndex((x: any) => x.code === location);
    let selectedCountry = this.locationList[index];
    this.location = selectedCountry.name;
  }

  //SET Category NAME
  setCategoryName(id: any, groupCategories: any) {
    let index = groupCategories.findIndex((x: any) => x.id === id);
    let categoryIndex = groupCategories[index];
    this.category = categoryIndex.name;
  }
  // SHOW ADMIN
  showAdmins(admin: any) {
    this.adminName = this.capitalizeFirstLetter(this.user.name);
    if (admin != undefined && admin.id != null) {
      if (admin.location != 'undefined') {
        let index = this.locationList.findIndex(
          (x: any) => x.code === admin.location
        );
        let selectedCountry = this.locationList[index];
        this.adminlocation = selectedCountry.name;
        this.countryFlag = selectedCountry.image;
      }

      this.adminImage = this.adminImageUrl + admin.image;
      let currrentUrl = new URL(window.location.href);
      let pathnamArray = currrentUrl.pathname.split('/');
      let dynamicUrl = '/profile/';
      if (pathnamArray.length > 2) {
        dynamicUrl = '/' + pathnamArray[1] + '/profile/';
      }

      this.adminSlug = this.origin + dynamicUrl + admin.user_name;
      this.showAdminBio = true;
      this.facebookUrl = admin.email_receive_message;
      this.setFacebookUrl();
    }
  }
  setFacebookUrl() {
    if (this.facebookUrl != null) {
      if (this.facebookUrl.indexOf('profile.php') > 0) {
        this.adminFacebookId = this.facebookUrl.split('?id=')[1];
      } else {
        this.adminFacebookId = this.facebookUrl.split('/');
        if (this.adminFacebookId[this.adminFacebookId.length - 1] != '') {
          this.adminFacebookId =
            this.adminFacebookId[this.adminFacebookId.length - 1];
        } else {
          this.adminFacebookId =
            this.adminFacebookId[this.adminFacebookId.length - 2];
        }
      }
    }
  }

  /* CAPITALIZE FIRST LETTER OF STRING
   @Parameter{string}
*/
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  scrollTarget(element: any) {
    var elems = document.querySelectorAll('.active');
    $('.tab-menu.active').removeClass('active');
    let tab = '.' + element + '-tab';
    $(tab).addClass('active');
    let el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setSocialLink() {
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    let dynamicUrl = '/group-profile/';
    if (pathnamArray.length > 2) {
      dynamicUrl = '/' + pathnamArray[1] + '/group-profile/';
    }
    this.profileUrl = this.origin + dynamicUrl + this.uniqueName;
    let url = this.origin + dynamicUrl + this.uniqueName;
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
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    let dynamicUrl = '/' + pathnamArray[1] + '/';
    if (pathnamArray.length > 3) {
      dynamicUrl = '/' + pathnamArray[1] + '/' + pathnamArray[2] + '/';
    }

    let profileSlug = this.origin + dynamicUrl + this.uniqueName;
    this.model_text = 'Copied';
    // this.clipboardService.copy(profileSlug);
    var textField = document.createElement('textarea');
    textField.innerText = profileSlug;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    console.log('should have copied ' + profileSlug);
    setTimeout(() => {
      this.model_text = 'Copy';
    }, 2000);
  }

  closePreview() {
    let body = window.parent.document.getElementsByTagName('body');
    if (body[0]) {
      body[0].removeAttribute('class');
    }

    let iframe = window.parent.document.getElementById('openIframe');
    if (iframe != null && iframe.parentNode != null) {
      iframe.parentNode.removeChild(iframe);
    }
    $('body').removeClass('hide-scroll');
  }

  publishProfile() {
    let publish = true;
    this.saveGroupProfile(publish);
  }

  saveGroupProfile(publish: any) {
    this.publishButtonText = 'Processing...';
    this.status = 1;
    this.publishGroup = localStorage.getItem('publishGroup');
    this.publishGroup = JSON.parse(this.publishGroup);
    const formData: FormData = new FormData();
    formData.append('categoryId', this.publishGroup.categoryId);
    formData.append('description', this.publishGroup.description);
    formData.append('locationId', this.publishGroup.locationId);
    formData.append('uniqueName', this.publishGroup.uniqueName);
    formData.append('topic', this.publishGroup.topic);
    formData.append('isTopic', this.publishGroup.isTopic.toString());
    formData.append(
      'isConversations',
      this.publishGroup.isConversations.toString()
    );

    formData.append('groupImage', this.groupFile);

    formData.append('isReview', this.publishGroup.isReview.toString());
    formData.append(
      'removeImage',
      JSON.stringify(this.publishGroup.removeImage)
    );
    formData.append('profile_id', this.publishGroup.profile_id);
    formData.append('status', this.status);

    let imagesArray = this.conversationFileList;
    for (let image of imagesArray) {
      formData.append('images[]', image);
    }

    formData.append('group_id', this.publishGroup.group_id);
    formData.append('fb_group_id', this.publishGroup.fb_group_id);
    this.apiService
      .saveGroupProfile(this.token, formData)
      .subscribe((response: any) => {
        this.publishButtonText = 'Publish Profile';
        if (response.status == 200) {
          if (publish) {
            this.displayPublishModel = true;
          }
        }
      });
  }

  uploadReviewImage(event: any) {
    this.reviewImage = event.target.files[0];
    let Imagesize = 5000000;
    if (Imagesize <= this.reviewImage) {
      this.msgs = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail: 'Image size should be less than 5 Mb ',
        },
      ];
    } else if (
      this.reviewImage.type != 'image/jpeg' &&
      this.reviewImage.type != 'image/png' &&
      this.reviewImage.type != 'image/jpg'
    ) {
      this.msgs = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail: 'Image type should be ( jpeg | jpg | png ) ',
        },
      ];
    } else {
      let objectURL = URL.createObjectURL(event.target.files[0]);
      this.reviewImageUrl = objectURL;
    }

    setTimeout(() => {
      this.msgs = [];
    }, 3000);
  }
  closePublishModel() {
    let url = new URL(window.location.href);
    let pathnamArray = url.pathname.split('/');
    let dynamicUrl = '/group-profiles';
    if (pathnamArray.length > 3) {
      dynamicUrl = '/' + pathnamArray[1] + '/group-profiles';
    }
    window.parent.location.href = url.origin + dynamicUrl;
  }
}
