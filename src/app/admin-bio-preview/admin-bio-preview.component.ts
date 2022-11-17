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
  origin: any;
  isMessageButton: any = false;
  displayCloseBtn: any = false;
  model_text: any = 'Copy';
  email: any = '';
  userName: any = '';
  facebookShare: any = '';
  instagramShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';
  image: any = 'assets/images/default.jpg';
  adminBioStorage: any = {};
  showShareBioBtn: boolean = true;
  shareImage = 'assets/images/share_gray.png';
  facebookUrl: any = '';
  adminFacebookId: any = '';
  firstName: any = '';
  public countryList: any = countriesObject;
  imageData: any = '';
  displayBasic: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.origin = location.origin;
    this.adminSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.displayCloseBtn =
      this.activatedRoute.snapshot.queryParams['displayClose'];
    if (this.displayCloseBtn) {
      this.spinner.show();
      this.displayCloseBtn = true;
      this.adminBioStorage = localStorage.getItem('adminBioStorage');
      this.adminBioStorage = JSON.parse(this.adminBioStorage);
      this.setAdminBIoPreview(this.adminBioStorage);
      setTimeout(() => {
        // all a tag not clickable on preview page
        $('a').addClass('clickDisable');
      }, 500);
    } else {
      this.spinner.show();
      this.getAdminBioPreview();
    }
  }
  getAdminBioPreview() {
    this.apiService
      .getAdminBioPreivew(this.adminSlug)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.setAdminBIoPreview(response);
        }
      });
  }

  setAdminBIoPreview(response: any) {
    this.spinner.hide();
    this.linkedGroups = response.Linked_groups;
    this.linkedGroupLength = response.Linked_groups.length;
    this.adminBio = response.admin_bio;
    this.userDetails = response.user_details;

    if (this.adminBio != null && this.adminBio.about_me != null) {
      this.about = this.adminBio.about_me;
    }
    console.log(this.adminBio.id);
    if (
      this.adminBio != null &&
      this.adminBio.id != null &&
      this.adminBio.id != undefined
    ) {
      this.showShareBioBtn = false;
      this.shareImage = 'assets/images/share_blue.png';
    }

    if (
      this.adminBio != null &&
      this.adminBio.social_profile != '' &&
      this.adminBio.social_profile != undefined
    ) {
      this.socialLinks = JSON.parse(this.adminBio.social_profile);
    }
    if (
      this.adminBio != null &&
      this.adminBio.achievements != '' &&
      this.adminBio.achievements != undefined
    ) {
      this.achievements = JSON.parse(this.adminBio.achievements);
    }
    if (
      this.adminBio != null &&
      this.adminBio.location != '' &&
      this.adminBio.location != undefined
    ) {
      this.setLocationValue(this.adminBio.location);
    }
    let token = localStorage.getItem('token');
    if (
      this.adminBio != null &&
      this.adminBio.is_message_button == 1 &&
      this.adminBio.email_receive_message != null &&
      this.adminBio.email_receive_message != undefined
    ) {
      this.isMessageButton = true;
      this.facebookUrl = this.adminBio.email_receive_message;
      this.setFacebookUrl();
    }
    if (
      this.adminBio != null &&
      this.adminBio.user_name != '' &&
      this.adminBio.user_name != undefined
    ) {
      this.userName = this.adminBio.user_name;

      let url = this.origin + '/profile/' + this.adminBio.user_name;
      this.facebookShare =
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(url);
      this.instagramShare = '';
      this.twitterShare =
        'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url);
      this.linkedInShare =
        'https://www.linkedin.com/sharing/share-offsite/?url=' +
        encodeURIComponent(url);
    }

    if (
      this.adminBio != null &&
      this.adminBio.image != '' &&
      this.adminBio.image != undefined
    ) {
      this.image = this.adminBio.image;
    }

    if (
      this.adminBio != null &&
      this.adminBio.adminImageCode != '' &&
      this.adminBio.adminImageCode != undefined
    ) {
      let blob = this.b64toBlob(this.adminBio.adminImageCode);
      this.imageData = new File([blob], this.adminBio.adminImageName, {
        type: 'image/jpeg',
      });
      console.log(this.imageData);
      let objectURL = URL.createObjectURL(this.imageData);
      console.log(objectURL);
    }

    if (this.userDetails.name.indexOf(' ') > -1) {
      let nameArray = this.userDetails.name.split(' ');
      this.firstName = this.capitalizeFirstLetter(nameArray[0]);
      let lastName = this.capitalizeFirstLetter(
        nameArray[nameArray.length - 1]
      );
      this.fullName =
        this.capitalizeFirstLetter(this.firstName) +
        ' ' +
        this.capitalizeFirstLetter(lastName);
    } else {
      this.firstName = this.capitalizeFirstLetter(this.userDetails.name);
      this.fullName = this.capitalizeFirstLetter(this.firstName);
    }
  }

  b64toBlob(dataURI: any) {
    // dataURI = dataURI.replace("''");
    console.log(dataURI);
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
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
    // let body = window.parent.document.getElementsByTagName('body');
    // if (body[0]) {
    //   body[0].removeAttribute('class');
    // }
    let iframe = window.parent.document.getElementById('openIframe');
    if (iframe != null && iframe.parentNode != null) {
      //console.log(iframe.parentNode);
      iframe.parentNode.removeChild(iframe);
    }
  }

  /* TO COPY ADMIN BIO PROFILE LINK FROM PUBLISH MODEL
  @Parameter{slug}
*/
  copyAdminProfileModel(slug: any) {
    let profileSlug = this.origin + '/profile/' + slug;
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

  setFacebookUrl() {
    console.log(this.facebookUrl);
    if (this.facebookUrl.indexOf('profile.php') > 0) {
      this.adminFacebookId = this.facebookUrl.split('?id=')[1];
    } else {
      this.adminFacebookId = this.facebookUrl.split('/');
      console.log(this.adminFacebookId);
      if (this.adminFacebookId[this.adminFacebookId.length - 1] != '') {
        this.adminFacebookId =
          this.adminFacebookId[this.adminFacebookId.length - 1];
      } else {
        this.adminFacebookId =
          this.adminFacebookId[this.adminFacebookId.length - 2];
      }
    }
  }
  previewPublished() {
    console.log('here');
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    console.log(this.adminBioStorage.user_details.id);
    let adminBio = this.adminBioStorage.admin_bio;
    console.log(adminBio);
    let about = '';
    if (adminBio.about_me != undefined) {
      about = adminBio.about_me;
    }
    let facebookUrl = '';
    if (adminBio.email_receive_message != undefined) {
      facebookUrl = adminBio.email_receive_message;
    }
    let location = '';
    if (adminBio.location != undefined) {
      location = adminBio.location;
    }
    let achievements = '';
    if (adminBio.achievements != undefined) {
      achievements = adminBio.achievements;
    }
    let social_profile = '';
    if (adminBio.social_profile != undefined) {
      social_profile = adminBio.social_profile;
    }
    let is_message_button = 'false';
    if (adminBio.is_message_button != undefined) {
      is_message_button = adminBio.is_message_button;
    }
    let parm = new FormData();
    parm.set('about', about);
    parm.set('email', facebookUrl);
    parm.set('location', location);
    parm.set('achievements', achievements);
    parm.set('user_id', this.adminBioStorage.user_details.id);
    parm.set('socialProfile', social_profile);
    parm.set('messageButton', is_message_button);
    parm.set('userName', adminBio.user_name);
    parm.set('image', this.imageData);

    this.saveAdminBioProfile(parm);
  }

  /* 
  TO CALL API TO SAVE ADMIN PROFILE.
  @Parameter{parm}
*/
  saveAdminBioProfile(parm: any) {
    let token = localStorage.getItem('token');
    this.apiService.saveAdminBio(token, parm).subscribe((response: any) => {
      if (response.status == 200) {
        this.displayBasic = true;
      }
    });
  }

  closePublishModel() {
    this.closePreview();
  }
}
