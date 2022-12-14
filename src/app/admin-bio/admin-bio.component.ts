import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { countriesObject } from '../../assets/json/countries';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';
import { SafePipe } from '../pipe/safe.pipe';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { splitNsName } from '@angular/compiler';

@Component({
  selector: 'app-admin-bio',
  templateUrl: './admin-bio.component.html',
  styleUrls: ['./admin-bio.component.css'],
  providers: [SafePipe],
})
export class AdminBioComponent implements OnInit {
  isChecked: boolean = false;
  displayBasic: boolean = false;
  displayCopy: boolean = false;
  showPreviewBtn: boolean = true;
  showShareBioBtn: boolean = true;
  disabledPublishButton: boolean = true;
  checkUniqueUserName: boolean = false;
  token: any;
  name: any;
  userDetails: any;
  adminBio: any;
  selectedCountry: any;
  selectedCountryCode: any = '';
  countryName: any = null;
  countryImage: any = null;
  fullName: any;
  firstName: any;
  lastName: any;
  slug: any;
  email: any = '';
  profileImage: any;
  selectedFile: any = null;
  linkedGroups: any;
  socialLinks: any = [];
  aboutMe: any = '';
  countryCode: any;
  achiveCount = 0;
  fields: any = '';
  acviveBtnFlag: any;
  isButtonVisible: any = true;
  isPublishBioModal: any = false;
  isiconVisible: any = true;
  adminBioForm: FormGroup;
  socialName: any = 'Facebook';
  socialHeading: any;
  textType: any = 'text';
  socialPlaceholder: any;
  showAddProfileBtn: any = true;
  errorMessage: any = '';
  text: any = 'Copy';
  model_text: any = 'Copy';
  public countryList: any = countriesObject;
  origin: any;
  displayIframe: any = false;
  iframeUrl: any;
  displayForm: any = true;
  imageUrl: any = 'assets/images/default.jpg';
  imageData: any = '';
  location: any = '';
  displaycloseButton: any = false;
  eyeImage: any = 'assets/images/eye_grey.png';
  userName: any = '';
  perviousUser: any = '';
  messageButton: any = 0;
  isTaken: any = false;
  facebookShare: any = '';
  instagramShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';
  adminBioStorage: any = {};
  facebookUrl: any = '';
  adminFacebookId: any = '';
  adminImageCode: any;
  msgs: any;
  formEnable: boolean = false;
  adminBioSlug: any = '';
  dynamicBioUrl: any = '/profile/';
  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private DOMSR: DomSanitizer,
    private fb: FormBuilder, // private safe: SafePipe
    private clipboardService: ClipboardService
  ) {
    this.origin = location.origin;
    this.name = localStorage.getItem('name');
    this.token = localStorage.getItem('token');

    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');
    if (pathnamArray.length > 2) {
      this.dynamicBioUrl = '/' + pathnamArray[1] + '/profile/';
    }

    this.adminBioSlug = this.origin + this.dynamicBioUrl;

    this.adminBioForm = this.fb.group({
      about: [''],
      userName: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
          asyncValidators: [
            this.apiService.userExistsValidator(this.token, this.userName),
          ],
        },
      ],
      facebookUrl: [
        '',
        [
          Validators.required,
          Validators.pattern('^(https?://)?(www.facebook.com|web.com)/.+$'),
        ],
      ],
      location: [''],
      isMessageButton: [''],
      achievements: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getAdminBioDetails();
  }

  get f() {
    return this.adminBioForm.controls;
  }

  /* LOGOUT*/
  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    setTimeout(() => {
      this.apiService.updateGroupOverview({}); // to clear behaviour variable. (to fix if different user is login then it display old user data in behaviour subject)
    }, 100);
    this.router.navigate(['login']);
  }
  /* GET AND SET ADMIN BIO PROFILE*/

  getAdminBioDetails() {
    this.token = localStorage.getItem('token');
    this.apiService.getAdminBio(this.token).subscribe((response: any) => {
      if (response.status == 200) {
        localStorage.setItem('adminBioStorage', JSON.stringify(response));
        this.adminBioStorage = localStorage.getItem('adminBioStorage');
        this.adminBioStorage = JSON.parse(this.adminBioStorage);
        this.linkedGroups = response.Linked_groups;
        this.setAdminBioValue(response);
        this.spinner.hide();
      }
    });
  }

  /* SET ADMIN BIO VALUES */
  setAdminBioValue(response: any) {
    this.disabledPublishButton = true;
    this.userDetails = response.user_details;

    this.adminBio = response.admin_bio;
    localStorage.setItem('userImage', '');
    if (this.adminBio != null) {
      if (this.adminBio.about_me != null) {
        this.aboutMe = this.adminBio.about_me;
      }

      if (this.adminBio.user_name != null) {
        this.disabledPublishButton = false;
        this.displayCopy = true;
        this.userName = this.adminBio.user_name;

        this.perviousUser = this.adminBio.user_name;

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

      this.messageButton = this.adminBio.is_message_button;
      if (this.adminBio.is_message_button == 1) {
        this.isChecked = true;
      }
      this.eyeImage = 'assets/images/eye.png';
      this.showPreviewBtn = false;
      this.showShareBioBtn = false;
      // set admin location
      if (this.adminBio.location != null) {
        this.location = this.adminBio.location;
        this.setLocationValue(this.location);
      }

      // set admin email
      if (this.adminBio.email_receive_message != null) {
        this.facebookUrl = this.adminBio.email_receive_message;
      }

      // set admin achievement value
      if (this.adminBio.achievements != null) {
        let achievements = JSON.parse(this.adminBio.achievements);
        const arr = this.adminBioForm.controls['achievements'] as FormArray;
        while (0 !== arr.length) {
          arr.removeAt(0);
        }
        this.setAchievementValueDynamic(achievements);
      }

      if (this.adminBio.social_profile != '') {
        this.socialLinks = JSON.parse(this.adminBio.social_profile);
      }
      localStorage.setItem('userImage', '');
      if (this.adminBio.image != '') {
        localStorage.setItem('userImage', this.adminBio.image);
        this.imageUrl = this.adminBio.image;
      }
    }
    if (this.userDetails.name.indexOf(' ') > -1) {
      let nameArray = this.userDetails.name.split(' ');
      this.firstName = this.capitalizeFirstLetter(nameArray[0]);
      this.lastName = this.capitalizeFirstLetter(
        nameArray[nameArray.length - 1]
      );
      this.fullName =
        this.capitalizeFirstLetter(this.firstName) +
        ' ' +
        this.capitalizeFirstLetter(this.lastName);
    } else {
      this.firstName = this.capitalizeFirstLetter(this.userDetails.name);
      this.fullName = this.capitalizeFirstLetter(this.firstName);
    }
  }

  /*COUNTRY SELECTION*/
  selectCountryOnChange(event: any) {
    this.countryCode = event.value;
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.location = this.countryCode;
    } else {
      this.adminBioStorage.admin_bio.location = this.countryCode;
    }
    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }

  public get htmlProperty(): SafeHtml {
    return this.DOMSR.bypassSecurityTrustHtml(this.fields);
  }

  /*CREATE ACHIEVEMENT DYNAMIC ROWS, ADD ,REMOVE, LENGTH CHECK*/
  achievements(): FormArray {
    return this.adminBioForm.get('achievements') as FormArray;
  }

  newAchievement(): FormGroup {
    return this.fb.group({
      achieve: '',
    });
  }

  addAchievement() {
    let previousCount = this.achiveCount - 1;
    if ($("[achieveIndex='" + previousCount + "']").val() != '') {
      this.achiveCount++;
      this.achievements().push(this.newAchievement());
      if (this.achiveCount == 3) {
        this.isButtonVisible = false;
      }
    }
  }

  removeAchievement(i: number) {
    this.achiveCount--;
    this.achievements().removeAt(i);
    if (i <= 3) {
      this.isButtonVisible = true;
    }
    this.setAchievement();
  }

  //END ACHIEVEMENT DYNAMIC ROWS

  /* CAPITALIZE FIRST LETTER OF STRING
   @Parameter{string}
*/
  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /*TO OPEN DYNAMIC SOCIAL MODEL AND SET DYNAMIC HEADING,NAME,TYPE,CANCEL BUTTON,RESET INPUT FIELD
  @Parameter{socialName}
*/
  openSocialModel(socialName: any) {
    (
      document.getElementsByClassName('socialLinkPop')[0] as HTMLInputElement
    ).value = '';

    this.showAddProfileBtn = true;
    this.errorMessage = '';
    if (socialName == 'Facebook' || socialName == 'LinkedIn') {
      this.isiconVisible = false;
      this.socialHeading = 'Profile URL';
      this.textType = 'url';
      this.socialPlaceholder = 'Paste profile URL here...';
    } else if (socialName == 'Instagram') {
      this.isiconVisible = true;
      this.socialHeading = 'Instagram handle';
      this.textType = 'text';
      this.socialPlaceholder = 'Your instagram handle';
    } else if (socialName == 'Twitter') {
      this.isiconVisible = true;
      this.socialHeading = 'Twitter handle';
      this.textType = 'text';
      this.socialPlaceholder = 'Your twitter handle';
    } else if (socialName == 'Youtube') {
      this.isiconVisible = false;
      this.socialHeading = 'Profile URL';
      this.textType = 'url';
      this.socialPlaceholder = 'Paste channel URL here...';
    } else if (socialName == 'Website') {
      this.isiconVisible = false;
      this.socialHeading = 'Profile URL';
      this.socialPlaceholder = 'Paste URL here...';
      this.textType = 'url';
    }

    this.socialName = socialName;
    let socialProfileModal = document.getElementById('add_social_profileModal');
    if (socialProfileModal != null) {
      let element: HTMLElement = socialProfileModal.getElementsByClassName(
        'cancel_btn'
      )[0] as HTMLElement;
      element.click();
    }
  }

  /*
  TO CHANGE VALUE ACCORDING TO SELECTED SOCIAL LINK AND VALIDATION 
  @Parameter{socialLink}
*/
  onEnterSocialLink(e: any, socialLink: any) {
    socialLink = e.target.value.replace(/^\d+|[\W_]?/, '');
    e.target.value = socialLink;

    this.errorMessage = '';
    this.showAddProfileBtn = true;
    if (socialLink.trim() != '') {
      if (this.socialName == 'Facebook') {
        if (socialLink.match('^(https?://)?(www.facebook.com|web.com)/.+$')) {
          this.showAddProfileBtn = false;
        } else {
          this.errorMessage = 'Enter valid facebook url';
        }
      } else if (this.socialName == 'LinkedIn') {
        if (socialLink.match('^(https?://)?(www.linkedin.com)/.+$')) {
          this.showAddProfileBtn = false;
        } else {
          this.errorMessage = 'Enter valid LinkedIn url';
        }
      } else if (this.socialName == 'Youtube') {
        if (socialLink.match('^(https?://)?(www.youtube.com|youtu.be)/.+$')) {
          this.showAddProfileBtn = false;
        } else {
          this.errorMessage = 'Enter valid Youtube url';
        }
      } else if (this.socialName == 'Website') {
        if (
          socialLink.match(
            'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}'
          )
        ) {
          this.showAddProfileBtn = false;
        } else {
          this.errorMessage = 'Enter valid Website/Blog url';
        }
      } else {
        this.showAddProfileBtn = false;
      }
    }
  }

  /*
  TO ADD SOCIAL LINK AND CREATE DYNAMIC ROW.
  @Parameter{socialLink}
*/
  AddSocialLink(socialLink: any) {
    let objectSocial = {};
    if (this.socialName == 'Twitter') {
      socialLink = 'http://twitter.com/' + socialLink;
    } else if (this.socialName == 'Instagram') {
      socialLink = 'https://www.instagram.com/' + socialLink;
    }
    objectSocial = {
      name: this.socialName,
      link: socialLink,
    };

    if (this.socialLinks.length > 0) {
      let matched = this.socialLinks.findIndex((value: any) => {
        return value.name == this.socialName;
      });

      if (matched > -1) {
        this.socialLinks[matched].link = socialLink;
      } else {
        this.socialLinks.push(objectSocial);
      }
    } else {
      this.socialLinks.push(objectSocial);
    }

    setTimeout(() => {
      let socialLinkModal = document.getElementById('social_linkModal');
      if (socialLinkModal != null) {
        let element: HTMLElement = socialLinkModal.getElementsByClassName(
          'cancel_btn'
        )[0] as HTMLElement;
        element.click();
        this.adminBioStorage = localStorage.getItem('adminBioStorage');
        this.adminBioStorage = JSON.parse(this.adminBioStorage);

        if (this.adminBioStorage.admin_bio == null) {
          this.adminBioStorage.admin_bio = {};
          this.adminBioStorage.admin_bio.social_profile = JSON.stringify(
            this.socialLinks
          );
        } else {
          this.adminBioStorage.admin_bio.social_profile = JSON.stringify(
            this.socialLinks
          );
        }
        localStorage.setItem(
          'adminBioStorage',
          JSON.stringify(this.adminBioStorage)
        );
      }
    }, 500);
  }
  /* TO DELET SOCIAL LINK 
  @Parameter{socialName}
*/
  deleteSocialLink(socialName: any) {
    if (this.socialLinks.length > 0) {
      let found = this.socialLinks.findIndex((value: any) => {
        return value.name == socialName;
      });
      if (found > -1) {
        this.socialLinks.splice(found, 1);
      }
    }
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.social_profile = JSON.stringify(
        this.socialLinks
      );
    } else {
      this.adminBioStorage.admin_bio.social_profile = JSON.stringify(
        this.socialLinks
      );
    }
    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }
  /* TO COPY ADMIN BIO PROFILE LINK 
  @Parameter{slug}
*/
  copyAdminProfile(slug: any) {
    this.adminBioSlug = this.origin + this.dynamicBioUrl + slug;
    this.text = 'Copied';
    this.clipboardService.copy(this.adminBioSlug);
    setTimeout(() => {
      this.text = 'Copy';
    }, 2000);
  }

  /* TO COPY ADMIN BIO PROFILE LINK FROM PUBLISH MODEL
  @Parameter{slug}
*/
  // copyAdminProfileModel(slug: any) {
  //   this.adminBioSlug = this.origin + this.dynamicBioUrl + slug;
  //   this.model_text = 'Copied';
  //   this.clipboardService.copy(this.adminBioSlug);

  //   setTimeout(() => {
  //     this.model_text = 'Copy';
  //   }, 2000);
  // }
  copyAdminProfileModel(slug: any) {
    this.adminBioSlug = this.origin + this.dynamicBioUrl + slug;
    this.model_text = 'Copied';

    var textField = document.createElement('textarea');
    textField.innerText = this.adminBioSlug;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    console.log('should have copied ' + this.adminBioSlug);
    setTimeout(() => {
      this.model_text = 'Copy';
    }, 2000);
  }

  /*SUBMIT COMPLETE ADMIN BIO FROM */
  onSubmit() {
    let about = this.adminBioForm.value.about;
    let email = this.adminBioForm.value.email;
    let userName = this.adminBioForm.value.userName;

    if (this.adminBioForm.value.location != undefined) {
      this.location = this.adminBioForm.value.location;
    }
    let achieveEmptyIndex = this.adminBioForm.value.achievements.findIndex(
      (value: any) => {
        return value.achieve == '';
      }
    );

    if (achieveEmptyIndex > -1) {
      this.adminBioForm.value.achievements.splice(achieveEmptyIndex, 1);
    }

    let achievements = JSON.stringify(this.adminBioForm.value.achievements);
    let user_id = this.userDetails.id;
    let socialProfile = JSON.stringify(this.socialLinks);

    // isMessageButton enable or disable
    this.messageButton = 0;
    if (this.adminBioForm.value.isMessageButton == true) {
      this.messageButton = 1;
    }
    let parm = new FormData();
    parm.set('about', about);
    parm.set('email', this.facebookUrl);
    parm.set('location', this.location);
    parm.set('achievements', achievements);
    parm.set('user_id', user_id);
    parm.set('socialProfile', socialProfile);
    parm.set('messageButton', this.messageButton);
    parm.set('userName', userName);
    parm.set('image', this.imageData);

    this.saveAdminBioProfile(parm);
  }
  /* 
  TO CALL API TO SAVE ADMIN PROFILE.
  @Parameter{parm}
*/
  saveAdminBioProfile(parm: any) {
    this.disabledPublishButton = true;
    this.apiService
      .saveAdminBio(this.token, parm)
      .subscribe((response: any) => {
        if (response.status == 200) {
          //show copy profile link popup
          this.displayBasic = true;
          this.setAdminBioValue(response);
        }
      });
  }

  /* 
  TO SET DB ACHIEVEMENT VALUE IN CONTROL.
  @Parameter{achievements}
*/
  setAchievementValueDynamic(achievements: any) {
    this.isButtonVisible = true;
    if (achievements.length == 3) {
      this.isButtonVisible = false;
    }
    this.achiveCount = achievements.length;
    const control = <FormArray>this.adminBioForm.controls['achievements'];
    achievements.forEach((x: any) => {
      control.push(
        this.fb.group({
          achieve: [x.achieve, Validators.required],
        })
      );
    });
  }
  /*
  TO SET DB LOCATION CODE.
  @Parameter{location code}
*/
  setLocationValue(location: any) {
    let index = this.countryList.findIndex((x: any) => x.code === location);
    this.selectedCountry = this.countryList[index];
    this.countryImage = this.selectedCountry.image;
    this.countryName = this.selectedCountry.name;
    this.selectedCountryCode = location;
  }

  /* OPEN ADMIN BIO PREVIEW */
  openPreview() {
    // $('#adminBioForm').closest('body').addClass('hide-scroll');
    let urlPreview =
      this.origin + this.dynamicBioUrl + this.userName + '?displayClose=true';
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

  /* GET UNIQUE USER NAME FOR ADMIN-BIO SLUG*/
  getUserName(event: any) {
    this.userName = event.target.value.trim();
    if (this.perviousUser != this.userName) {
      if (this.userName != '') {
        this.disabledPublishButton = false;
      } else {
        this.disabledPublishButton = true;
      }
    }
  }
  /* MESSAGE BUTTON SHOW OR HIDE*/
  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.isChecked = true;
      this.messageButton = 1;
    } else {
      this.isChecked = false;
      this.messageButton = 0;
    }

    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.is_message_button = this.messageButton;
    } else {
      this.adminBioStorage.admin_bio.is_message_button = this.messageButton;
    }
    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }
  // UPLOAD ADMIN BIO IMAGE
  uploadImages(event: any) {
    this.imageData = event.target.files[0];
    let Imagesize = 5000000;
    if (Imagesize <= this.imageData.size) {
      this.msgs = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail: 'Image size should be less than 5 Mb ',
        },
      ];
    } else if (
      this.imageData.type != 'image/jpeg' &&
      this.imageData.type != 'image/png' &&
      this.imageData.type != 'image/jpg'
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
      this.imageUrl = objectURL;
      this.adminBioStorage = localStorage.getItem('adminBioStorage');
      this.adminBioStorage = JSON.parse(this.adminBioStorage);

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.adminImageCode = reader.result;
        };
      }
      setTimeout(() => {
        if (this.adminBioStorage.admin_bio == null) {
          this.adminBioStorage.admin_bio = {};
          this.adminBioStorage.admin_bio.image = this.imageUrl;
          this.adminBioStorage.admin_bio.adminImageCode = this.adminImageCode;
          this.adminBioStorage.admin_bio.adminImageName =
            event.target.files[0].name;
        } else {
          this.adminBioStorage.admin_bio.image = this.imageUrl;
          this.adminBioStorage.admin_bio.adminImageCode = this.adminImageCode;
          this.adminBioStorage.admin_bio.adminImageName =
            event.target.files[0].name;
        }
        localStorage.setItem(
          'adminBioStorage',
          JSON.stringify(this.adminBioStorage)
        );
      }, 1000);
    }
    setTimeout(() => {
      this.msgs = [];
    }, 3000);
  }
  // CREATE UNIQUE NAME - remove special char num and change space into hyphen
  createUniqueUserName(x: any) {
    this.userName = x.target.value
      .replace(/^\d+|[\W_]?/, '')
      .replace(/[^a-zA-Z- ]/g, '')
      .replace(/\s/g, '-')
      .replace(/[-]+/g, '-')
      .toLowerCase();
    x.target.value = this.userName;

    if (this.userName.trim()) {
      this.showPreviewBtn = false;
      this.eyeImage = 'assets/images/eye.png';
    }

    this.adminBioSlug = this.origin + this.dynamicBioUrl + this.userName;

    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);

    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.user_name = this.userName;
    } else {
      this.adminBioStorage.admin_bio.user_name = this.userName;
    }
    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }

  //SET IN LOCAL STORAGE FOR PREVIEW

  getAbout() {
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);
    if (this.aboutMe.trim() != '') {
      if (this.adminBioStorage.admin_bio == null) {
        this.adminBioStorage.admin_bio = {};
        this.adminBioStorage.admin_bio.about_me = this.aboutMe;
      } else {
        this.adminBioStorage.admin_bio.about_me = this.aboutMe;
      }
      localStorage.setItem(
        'adminBioStorage',
        JSON.stringify(this.adminBioStorage)
      );
    }
  }
  setAchievements() {
    let achievements = JSON.stringify(this.adminBioForm.value.achievements);
    this.setAchievement();
  }

  setAchievement() {
    let achievements = JSON.stringify(this.adminBioForm.value.achievements);
    this.adminBioStorage = localStorage.getItem('adminBioStorage');
    this.adminBioStorage = JSON.parse(this.adminBioStorage);

    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.achievements = achievements;
    } else {
      this.adminBioStorage.admin_bio.achievements = achievements;
    }

    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }

  setFacebookUrl() {
    if (this.adminBioStorage.admin_bio == null) {
      this.adminBioStorage.admin_bio = {};
      this.adminBioStorage.admin_bio.email_receive_message = this.facebookUrl;
    } else {
      this.adminBioStorage.admin_bio.email_receive_message = this.facebookUrl;
    }
    localStorage.setItem(
      'adminBioStorage',
      JSON.stringify(this.adminBioStorage)
    );
  }

  closePublishModel() {
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 500);
  }

  // End SET IN LOCAL STORAGE FOR PREVIEW
}
