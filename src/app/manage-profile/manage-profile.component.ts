import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {
  origin: any;
  groupSlug: any;
  groupId: any;
  id: any;
  token: any;
  adminBio: any = [];
  groupImages: any = '';
  groupReview: any = [];
  linkedGroup: any = [];
  selectedCategory: any = '';
  about: any = '';
  facebookGroupId: any = '';
  selectedLocation: any = '';
  status: any = '';
  topics: any = '';
  uniqueName: any = '';
  userId: any = '';
  groupCreated: any = '';
  conversationImageUrl = '';
  adminImageUrl = '';
  conversations: any = [];
  adminImage = 'assets/images/default.jpg';
  groupCategories: any = [];
  categoryId: any = '';
  category: any = '';
  location: any = '';
  created: any = '';
  responsiveOptions: any = [];
  user: any = [];
  adminName: any = '';
  countryFlag: any = '';
  adminlocation: any = '';
  showAdminBio: boolean = true;
  adminSlug: any = '';
  public isSeeMore: boolean = true;
  averageRating: any = 0;
  public locationList: any = countriesObject;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.origin = location.origin;
    this.spinner.show();
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.groupId = params['group_id'];
      if (params['id']) {
        this.id = params['id'];
      }
    });
    console.log(this.id);
    console.log(this.groupId);
    this.getManageProfileDetails();
  }

  getManageProfileDetails() {
    this.apiService
      .getManageProfileDetails(this.id, this.groupId, this.token)
      .subscribe((response: any) => {
        //console.log(response);
        this.spinner.hide();
        if (response.status == 200) {
          let groupDetails = response.groupDetails;
          this.conversationImageUrl = response.groupImageUrl;
          this.adminImageUrl = response.adminImageUrl;
          this.adminBio = groupDetails.admin_bio;
          this.user = groupDetails.user;
          if (this.user.length > 0) {
            this.user = this.user[0];
            this.adminName = this.capitalizeFirstLetter(this.user.name);
          }
          this.groupCategories = response.groupCategories;
          if (this.adminBio.length > 0) {
            this.adminBio = this.adminBio[0];
            this.showAdmins(this.adminBio);
          }
          this.groupReview = groupDetails.group_reviews;
          this.conversations = groupDetails.group_conversation_images;
          this.linkedGroup = groupDetails.linked_fb_group;

          console.log(this.adminBio);
          console.log(this.user);
          console.log(this.groupReview);
          console.log(this.conversations);
          console.log(this.linkedGroup);
          console.log(this.conversationImageUrl);
          console.log(this.adminImageUrl);

          this.categoryId = groupDetails.category_id;
          this.setCategoryName(this.categoryId, this.groupCategories);
          this.about = groupDetails.description;
          this.facebookGroupId = groupDetails.fb_group_id;
          this.id = groupDetails.id;
          this.selectedLocation = groupDetails.location_id;
          this.setLocationValue(this.selectedLocation);
          this.status = groupDetails.status;
          this.topics = groupDetails.topic.split(',');
          this.uniqueName = groupDetails.unique_name;
          this.userId = groupDetails.user_id;
          this.created = groupDetails.created_at;

          this.averageRating = this.calculateAverageReview();
        }
      });
  }

  setCategoryName(id: any, groupCategories: any) {
    let index = groupCategories.findIndex((x: any) => x.id === id);
    let categoryIndex = groupCategories[index];
    console.log;
    this.category = categoryIndex.name;
    this.selectedCategory = categoryIndex.id;
  }

  setLocationValue(location: any) {
    let index = this.locationList.findIndex((x: any) => x.code === location);
    let selectedCountry = this.locationList[index];
    this.location = selectedCountry.name;
  }

  /* CAPITALIZE FIRST LETTER OF STRING
   @Parameter{string}
*/
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  showAdmins(admin: any) {
    console.log(admin);
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

  calculateAverageReview() {
    let totalRating = this.groupReview.length * 5;
    let maxNumberOfStars = 0;
    for (let i = 0; i < this.groupReview.length; i++) {
      maxNumberOfStars = parseInt(this.groupReview[i].star) + maxNumberOfStars;
    }
    let likePercentageStars = (5 / totalRating) * maxNumberOfStars;
    return likePercentageStars;
  }
}
