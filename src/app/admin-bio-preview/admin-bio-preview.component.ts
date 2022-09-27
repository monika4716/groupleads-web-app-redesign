import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-bio-preview',
  templateUrl: './admin-bio-preview.component.html',
  styleUrls: ['./admin-bio-preview.component.css'],
})
export class AdminBioPreviewComponent implements OnInit {
  adminSlug: any;
  userId: any;
  linkedGroups: any = [];
  userDetails: any;
  linkedGroupLength: any;
  adminBio: any;
  socialLinks: any = [];
  achievements: any = [];
  about: any;
  selectedCountry: any;
  countryImage: any;
  countryName: any;
  fullName: any;
  displayCloseBtn: any = false;
  public countryList: any = countriesObject;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.adminSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log(this.adminSlug);
    // this.userId = this.adminSlug.split('-')[1];
    this.getAdminBioPreview();

    this.displayCloseBtn =
      this.activatedRoute.snapshot.queryParams['displayClose'];
    if (this.displayCloseBtn) {
      this.displayCloseBtn = true;
    }
  }
  getAdminBioPreview() {
    this.apiService
      .getAdminBioPreivew(this.adminSlug)
      .subscribe((response: any) => {
        console.log(response);
        this.spinner.hide();
        if (response.status == 200) {
          this.linkedGroups = response.Linked_groups;
          this.linkedGroupLength = response.Linked_groups.length;
          this.adminBio = response.admin_bio;
          this.userDetails = response.user_details;

          if (this.adminBio != null && this.adminBio.about_me != null) {
            this.about = this.adminBio.about_me;
          }

          if (this.adminBio != null && this.adminBio.social_profile != '') {
            this.socialLinks = JSON.parse(this.adminBio.social_profile);
          }
          if (this.adminBio != null && this.adminBio.achievements != '') {
            this.achievements = JSON.parse(this.adminBio.achievements);
          }
          if (this.adminBio != null && this.adminBio.location != '') {
            this.setLocationValue(this.adminBio.location);
          }
          if (this.userDetails.name.indexOf(' ') > -1) {
            let nameArray = this.userDetails.name.split(' ');
            let firstName = this.capitalizeFirstLetter(nameArray[0]);
            let lastName = this.capitalizeFirstLetter(
              nameArray[nameArray.length - 1]
            );
            this.fullName =
              this.capitalizeFirstLetter(firstName) +
              ' ' +
              this.capitalizeFirstLetter(lastName);
          } else {
            let firstName = this.capitalizeFirstLetter(this.userDetails.name);
            this.fullName = this.capitalizeFirstLetter(firstName);
          }
        }
      });
    console.log(this.userId);
  }

  /*
    TO SET DB LOCATION CODE.
    @Parameter{location code}
  */
  setLocationValue(location: any) {
    let index = this.countryList.findIndex(
      (x: any): any => x.code === location
    );
    this.selectedCountry = this.countryList[index];
    this.countryImage = this.selectedCountry.image;
    this.countryName = this.selectedCountry.name;
  }

  /* CAPITALIZE FIRST LETTER OF STRING
     @Parameter{string}
  */
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  closePreview() {
    console.log('here');
    let iframe = window.parent.document.getElementById('openIframe');
    if (iframe != null && iframe.parentNode != null) {
      iframe.parentNode.removeChild(iframe);
    }
  }
}
