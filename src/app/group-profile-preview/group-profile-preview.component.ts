import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';

@Component({
  selector: 'app-group-profile-preview',
  templateUrl: './group-profile-preview.component.html',
  styleUrls: ['./group-profile-preview.component.css'],
})
export class GroupProfilePreviewComponent implements OnInit {
  origin: any;
  groupSlug: any;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.origin = location.origin;
    this.spinner.show();
    this.groupSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.getGroupProfilePreview();
  }

  getGroupProfilePreview() {
    console.log(this.groupSlug);
    this.apiService
      .getGroupProfilePreview(this.groupSlug)
      .subscribe((response: any) => {
        if (response.status == 200) {
          console.log(response);
          let groupDetails = response.groupDetails;
          let groupCategories = response.groupCategories;

          this.reviews = response.profileReviews;

          this.groupName = groupDetails.group_name;
          let selectedLocation = groupDetails.location_id;
          let selectedCategory = groupDetails.category_id;
          this.setCategoryNamr(selectedCategory, groupCategories);
          this.setLocationValue(selectedLocation);
          this.createdProfile = groupDetails.created_at;
          this.about = groupDetails.description;
          this.topics = groupDetails.topic.split(',');
          this.conversations = response.profileImages;
          this.path = response.path;
          this.facebookGroupLink =
            'https://www.facebook.com/groups/' + groupDetails.fb_group_id;

          console.log(this.conversations);

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
  setCategoryNamr(id: any, groupCategories: any) {
    let index = groupCategories.findIndex((x: any) => x.id === id);
    let categoryIndex = groupCategories[index];
    this.category = categoryIndex.name;
  }

  showAdmins(admin: any) {
    this.adminName = this.capitalizeFirstLetter(admin.name);

    if (admin.id != null) {
      let index = this.locationList.findIndex(
        (x: any) => x.code === admin.location
      );
      let selectedCountry = this.locationList[index];

      this.adminlocation = selectedCountry.name;
      this.countryFlag = selectedCountry.image;
      this.adminImage = admin.image;
      this.adminSlug = this.origin + '/profile/' + admin.adminSlug;
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
    let url = this.origin + '/group-profile/' + this.groupSlug;
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
    let profileSlug = this.origin + '/group-profile/' + this.groupSlug;
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
