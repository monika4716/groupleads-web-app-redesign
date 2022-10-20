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

@Component({
  selector: 'app-group-profile-preview',
  templateUrl: './group-profile-preview.component.html',
  styleUrls: ['./group-profile-preview.component.css'],
})
export class GroupProfilePreviewComponent implements OnInit {
  origin: any;
  uniqueName: any;
  groupName: any = '';
  public locationList: any = countriesObject;
  location: any = '';
  category: any = '';
  createdProfile: any = '';
  about: any = '';
  public isSeeMore: boolean = true;
  topics: any = [];
  reviews: any = [];
  conversations: any = [];
  user: any;
  path: any = '';
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
  overviewStorage: any;
  topicStorage: any;
  conversationStorage: any;
  reviewSettingStorage: any;
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
  disableWriteReviewBtn: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.editReviewsForm = this.fb.group({
      rating: [''],
      review: ['', Validators.required],
    });
    this.editReviewSettingForm = this.fb.group({
      isReview: [''],
    });
  }

  ngOnInit(): void {
    this.origin = location.origin;
    this.previewEnable = this.activatedRoute.snapshot.queryParams['preview'];
    console.log(this.previewEnable);
    if (this.previewEnable) {
      this.disableWriteReviewBtn = true;
      this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
      this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
      console.log(this.manageProfileStorage);

      this.showPreviewDetails(this.manageProfileStorage);
    } else {
      this.spinner.show();
      this.disableWriteReviewBtn = false;
      this.uniqueName = this.activatedRoute.snapshot.paramMap.get('slug');
      //this.getGroupProfilePreview();
    }
  }

  showPreviewDetails(response: any) {
    console.log(response);
    this.adminImageUrl = response.adminImageUrl;
    this.conversationImageUrl = response.conversationImageURl;
    this.groupImageUrl = response.groupImageUrl;
    let groupCategories = response.groupCategories;
    let groupDetails = response.groupDetails;
    let adminDetails = groupDetails.admin_bio[0];
    let linkedDetails = groupDetails.linked_fb_group;
    this.reviews = groupDetails.group_reviews;
    this.conversations = groupDetails.group_conversation_images;
    this.user = groupDetails.user[0];
    this.groupName = linkedDetails.group_name;
    this.selectedLocation = groupDetails.location_id;
    this.selectedCategory = groupDetails.category_id;
    this.setCategoryName(this.selectedCategory, groupCategories);
    this.setLocationValue(this.selectedLocation);
    this.createdProfile = groupDetails.created_at;
    this.about = groupDetails.description;
    this.topics = groupDetails.topic;
    if (!Array.isArray(this.topics)) {
      this.topics = this.topics.split(' ');
    }
    this.showConversationImage();
    if (this.conversationsImage.length == 0) {
      this.conversationsImage = this.conversations;
    }
    if (groupDetails.image) {
      this.groupImage = groupDetails.image;
    }
    this.facebookGroupLink =
      'https://www.facebook.com/groups/' + groupDetails.fb_group_id;

    this.showAdmins(adminDetails);
    this.setSocialLink();
    this.averageRating = this.calculateAverageReview();
  }

  showConversationImage() {
    this.conversationsImage = [];
    console.log(this.conversations);
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

  calculateAverageReview() {
    let totalRating = this.reviews.length * 5;
    let maxNumberOfStars = 0;
    for (let i = 0; i < this.reviews.length; i++) {
      maxNumberOfStars = parseInt(this.reviews[i].star) + maxNumberOfStars;
    }
    let likePercentageStars = (5 / totalRating) * maxNumberOfStars;
    return likePercentageStars;
  }

  editReviews() {
    console.log(this.editReviewsForm);
    this.rating = this.editReviewsForm.value.rating;
    this.review = this.editReviewsForm.value.review;
    setTimeout(() => {
      $('#editReviews_close').click();
    }, 1000);
  }
  editReviewSetting() {
    console.log(this.editReviewSettingForm.value);
    this.isReview = this.editReviewSettingForm.value.isReview;
  }

  get r() {
    return this.editReviewsForm.controls;
  }

  getGroupProfilePreview() {
    console.log(this.uniqueName);
    this.apiService
      .getGroupProfilePreview(this.uniqueName)
      .subscribe((response: any) => {
        if (response.status == 200) {
          console.log(response);
          let groupDetails = response.groupDetails;
          let groupCategories = response.groupCategories;
          this.reviews = response.profileReviews;
          this.groupName = groupDetails.group_name;
          this.selectedLocation = groupDetails.location_id;
          this.selectedCategory = groupDetails.category_id;
          this.setCategoryName(this.selectedCategory, groupCategories);
          this.setLocationValue(this.selectedLocation);
          this.createdProfile = groupDetails.created_at;
          this.about = groupDetails.description;
          this.topics = groupDetails.topic.split(',');
          this.conversations = response.profileImages;
          this.path = response.path;
          this.uniqueName = groupDetails.unique_name.toLowerCase();
          this.facebookGroupLink =
            'https://www.facebook.com/groups/' + groupDetails.fb_group_id;
          let adminDetails = response.adminDetails;
          this.showAdmins(adminDetails);
          this.setSocialLink();
        }
      });
  }

  setLocationValue(location: any) {
    let index = this.locationList.findIndex((x: any) => x.code === location);
    let selectedCountry = this.locationList[index];
    this.location = selectedCountry.name;
  }
  setCategoryName(id: any, groupCategories: any) {
    let index = groupCategories.findIndex((x: any) => x.id === id);
    let categoryIndex = groupCategories[index];
    this.category = categoryIndex.name;
  }

  showAdmins(admin: any) {
    //console.log(admin);
    //console.log(this.user);
    this.adminName = this.capitalizeFirstLetter(this.user.name);
    if (admin.id != null) {
      let index = this.locationList.findIndex(
        (x: any) => x.code === admin.location
      );
      let selectedCountry = this.locationList[index];

      this.adminlocation = selectedCountry.name;
      this.countryFlag = selectedCountry.image;
      this.adminImage = this.adminImageUrl + admin.image;
      this.adminSlug = this.origin + '/profile/' + admin.user_name;
      this.showAdminBio = true;
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
    let url = this.origin + '/group-profile/' + this.uniqueName;
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
    let profileSlug = this.origin + '/group-profile/' + this.uniqueName;
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

  closePreview() {
    console.log('here');
    let iframe = window.parent.document.getElementById('openIframe');
    if (iframe != null && iframe.parentNode != null) {
      console.log(iframe.parentNode);
      iframe.parentNode.removeChild(iframe);
    }
  }
}
