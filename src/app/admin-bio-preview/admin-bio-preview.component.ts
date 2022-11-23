import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClipboardService } from 'ngx-clipboard';

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
  dynamicBioUrl: any = '/profile/';
  adminBioSlug: any = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.origin = location.origin;
    this.adminSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.displayCloseBtn =
      this.activatedRoute.snapshot.queryParams['displayClose'];
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    if (pathnamArray.length > 2) {
      this.dynamicBioUrl = '/' + pathnamArray[1] + '/profile/';
    }

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
      this.shareImage = 'assets/images/share_blue.png';
    }
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

      this.adminBioSlug =
        this.origin + this.dynamicBioUrl + this.adminBio.user_name;
      this.facebookShare =
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(this.adminBioSlug);
      this.instagramShare = '';
      this.twitterShare =
        'https://twitter.com/intent/tweet?url=' +
        encodeURIComponent(this.adminBioSlug);
      this.linkedInShare =
        'https://www.linkedin.com/sharing/share-offsite/?url=' +
        encodeURIComponent(this.adminBioSlug);
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
      let objectURL = URL.createObjectURL(this.imageData);
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
    let iframe = window.parent.document.getElementById('openIframe');
    if (iframe != null && iframe.parentNode != null) {
      iframe.parentNode.removeChild(iframe);
    }
  }

  /* TO COPY ADMIN BIO PROFILE LINK FROM PUBLISH MODEL
  @Parameter{slug}
*/
  copyAdminProfileModel(slug: any) {
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    let dynamicUrl = '/' + pathnamArray[1] + '/';
    if (pathnamArray.length > 3) {
      dynamicUrl = '/' + pathnamArray[1] + '/' + pathnamArray[2] + '/';
    }
    let profileSlug = this.origin + dynamicUrl + slug;
    this.model_text = 'Copied';
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

  setFacebookUrl() {
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
  previewPublished() {
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    let adminBio = this.adminBioStorage.admin_bio;
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
