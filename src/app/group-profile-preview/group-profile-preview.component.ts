import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';

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
  adminImage: any = '';
  adminSlug: any = '';

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
          console.log(this.conversations);

          let adminDetails = response.adminDetails;
          this.showAdmins(adminDetails);
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
    let index = this.locationList.findIndex(
      (x: any) => x.code === admin.location
    );
    let selectedCountry = this.locationList[index];
    this.adminlocation = selectedCountry.name;
    this.countryFlag = selectedCountry.image;
    this.adminImage = admin.image;
    this.adminSlug = this.origin + '/profile/' + admin.adminSlug;
  }

  /* CAPITALIZE FIRST LETTER OF STRING
   @Parameter{string}
*/
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
