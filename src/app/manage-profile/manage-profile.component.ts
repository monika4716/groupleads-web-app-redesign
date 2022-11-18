import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { countriesObject } from '../../assets/json/countries';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {
  displayIframe: boolean = false;
  iframeUrl: any = '';
  origin: any;
  groupId: any;
  id: any;
  token: any;
  adminBio: any = [];
  groupImages: any = '';
  previousGroupImage: any = '';
  groupReview: any = [];
  linkedGroup: any = [];
  selectedCategory: any = 0;
  description: any = '';
  facebookGroupId: any = '';
  selectedLocation: any = 0;
  status: any = '';
  topics: any = '';
  uniqueName: any = '';
  userId: any = '';
  groupCreated: any = '';
  conversationImageUrl = '';
  adminImageUrl = '';
  conversationImages: any = [];
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
  rating: any = 0;
  review: any = '';
  public locationList: any = countriesObject;
  model_text: any = 'Copy';
  showLessMore: boolean = false;
  facebookShare: any = '';
  twitterShare: any = '';
  linkedInShare: any = '';
  instagramShare: any = '';
  editOverViewForm: FormGroup;
  editTopicsForm: FormGroup;
  editConversationsForm: FormGroup;
  editReviewSettingForm: FormGroup;
  editReviewsForm: FormGroup;
  isTopic: boolean = true;
  isConversations: boolean = true;
  isReview: boolean = true;
  removeImage: any = [];
  urls = new Array<string>();
  fileList: File[] = [];
  listOfFiles: any[] = [];
  files: any = [];
  msgs: any;
  uploadUrls: any = [];
  groupFile: any = [];
  groupImage: any = 'assets/images/profile_banner.png';
  displayReviewModel: boolean = false;
  imageData: any = '';
  displayForm: boolean = true;
  displaycloseButton: boolean = false;
  writeReview: boolean = true;
  overviewStorage: any = {};
  topicStorage: any = {};
  conversationStorage: any = {};
  reviewSettingStorage: any = {};
  manageProfileStorage: any = {};
  publishimages: any = [];
  publishGroup: any = {};
  image: any = {};
  displayPublishModel: boolean = false;
  reviewImageUrl = '';
  uploadedImageName: any = '';
  groupImageCode: any;
  conversationNum: any = 3;
  publishButtonText = 'Publish Profile';
  conversationImagesCode = new Array<string>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editOverViewForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
    });
    this.editTopicsForm = this.fb.group({
      isTopic: [''],
      topics: [''],
    });

    this.editConversationsForm = this.fb.group({
      isConversations: [''],
      conversations: [''],
    });

    this.editReviewsForm = this.fb.group({
      rating: [''],
      review: ['', Validators.required],
    });
    this.editReviewSettingForm = this.fb.group({
      isReview: [''],
    });

    this.responsiveOptions = [
      {
        breakpoint: '768px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '230px',
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
      this.groupId = params['group_id'];
      if (params['id']) {
        this.id = params['id'];
      }
    });
    console.log('id', this.id);
    console.log('group-id', this.groupId);
    this.getManageProfileDetails();
  }

  get o() {
    return this.editOverViewForm.controls;
  }
  get r() {
    return this.editReviewsForm.controls;
  }

  getManageProfileDetails() {
    //console.log(this.id);
    //console.log(this.groupId);

    this.apiService
      .getManageProfileDetails(this.id, this.groupId, this.token)
      .subscribe((response: any) => {
        console.log(response);

        if (response.status == 200) {
          this.apiService.updateGroupManage(response);
          localStorage.setItem(
            'manageProfileStorage',
            JSON.stringify(response)
          );

          let groupDetails = response.groupDetails;
          this.conversationImageUrl = response.conversationImageURl;
          this.adminImageUrl = response.adminImageUrl;
          this.reviewImageUrl = response.reviewImageUrl;
          this.adminBio = groupDetails.admin_bio;
          this.user = groupDetails.user;
          this.conversationImages = groupDetails.group_conversation_images;
          this.showConversationImages();

          this.groupReview = groupDetails.group_reviews;
          console.log(this.groupReview);

          if (this.user.length > 0) {
            this.user = this.user[0];
            this.adminName = this.capitalizeFirstLetter(this.user.name);
          }
          this.groupCategories = response.groupCategories;
          if (this.adminBio.length > 0) {
            this.adminBio = this.adminBio[0];
            this.showAdmins(this.adminBio);
          }
          this.isReview = true;
          if (groupDetails.is_reviews == 0) {
            this.isReview = false;
          }
          this.isConversations = true;
          if (groupDetails.is_conversations == 0) {
            this.isConversations = false;
          }
          this.isTopic = true;
          if (groupDetails.is_topics == 0) {
            this.isTopic = false;
          }

          this.linkedGroup = groupDetails.linked_fb_group;
          this.categoryId = groupDetails.category_id;
          this.setCategoryName(this.categoryId, this.groupCategories);
          this.description = groupDetails.description;

          if (groupDetails.description.length > 350) {
            this.showLessMore = true;
          }
          this.facebookGroupId = groupDetails.fb_group_id;
          if (groupDetails.image != '') {
            this.groupImage = response.groupImageUrl + '/' + groupDetails.image;
          }

          this.previousGroupImage = groupDetails.image;
          this.id = groupDetails.id;
          this.selectedLocation = groupDetails.location_id;
          this.setLocationValue(this.selectedLocation);
          this.status = groupDetails.status;
          if (groupDetails.topic != null) {
            this.topics = groupDetails.topic.split(',');
          }

          this.uniqueName = groupDetails.unique_name.toLowerCase();
          this.userId = groupDetails.user_id;
          this.created = groupDetails.created_at;
          this.averageRating = this.calculateAverageReview();
          this.setSocialLink();

          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
        } else {
          this.spinner.hide();
        }
      });
  }

  setCategoryName(id: any, groupCategories: any) {
    id = parseInt(id);
    let index = groupCategories.findIndex((x: any) => x.id === id);
    let categoryIndex = groupCategories[index];
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
    if (admin.id != null) {
      if (admin.location != 'undefined' && admin.location != null) {
        let index = this.locationList.findIndex(
          (x: any) => x.code === admin.location
        );
        let selectedCountry = this.locationList[index];
        console.log(selectedCountry);
        this.adminlocation = selectedCountry.name;
        this.countryFlag = selectedCountry.image;
      }
      this.adminImage = this.adminImageUrl + admin.image;

      let currrentUrl = new URL(window.location.href);
      let pathnamArray = currrentUrl.pathname.split('/');

      console.log(pathnamArray);
      let dynamicUrl = '/profile/';
      if (pathnamArray.length > 2) {
        dynamicUrl = '/' + pathnamArray[1] + '/profile/';
      }

      this.adminSlug = this.origin + dynamicUrl + admin.user_name;
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
      maxNumberOfStars =
        parseInt(this.groupReview[i].rating) + maxNumberOfStars;
    }
    let likePercentageStars = Math.round((5 / totalRating) * maxNumberOfStars);
    return likePercentageStars;
  }

  copyGroupProfileModel(slug: any) {
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');

    console.log(pathnamArray);
    let dynamicUrl = '/group-profile/';
    if (pathnamArray.length > 2) {
      dynamicUrl = '/' + pathnamArray[1] + '/group-profile/';
    }

    let profileSlug = this.origin + dynamicUrl + this.uniqueName;
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

  setSocialLink() {
    let currrentUrl = new URL(window.location.href);
    let pathnamArray = currrentUrl.pathname.split('/');

    console.log(pathnamArray);
    let dynamicUrl = '/group-profile/';
    if (pathnamArray.length > 2) {
      dynamicUrl = '/' + pathnamArray[1] + '/group-profile/';
    }

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

  onChangeCategory(e: any) {
    console.log(e);
    this.selectedCategory = e.value;
  }

  onChangeLocation(e: any) {
    console.log(e);
    this.selectedLocation = e.value;
  }

  editOverview() {
    console.log(this.editOverViewForm);
    this.description = this.editOverViewForm.value.description;
    this.selectedCategory = this.editOverViewForm.value.category;
    this.selectedLocation = this.editOverViewForm.value.location;

    // set the updated value in manageProfileStorage storage //

    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);

    this.manageProfileStorage.groupDetails.description = this.description;
    this.manageProfileStorage.groupDetails.category_id = parseInt(
      this.selectedCategory
    );
    this.manageProfileStorage.groupDetails.location_id = this.selectedLocation;

    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );

    // end  the updated value in manageProfileStorage storage //

    this.setLocationValue(this.selectedLocation);
    this.setCategoryName(this.selectedCategory, this.groupCategories);

    setTimeout(() => {
      $('#edit_overview_close').click();
    }, 500);
  }

  editTopics() {
    //console.log(this.editTopicsForm);
    this.isTopic = this.editTopicsForm.value.isTopic;
    this.topics = this.editTopicsForm.value.topics;

    // set the updated value in manageProfileStorage storage //

    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);

    this.manageProfileStorage.groupDetails.is_topics = this.isTopic;
    this.manageProfileStorage.groupDetails.topic = this.topics;

    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );

    //end set storage

    setTimeout(() => {
      $('#editTopics_cancel').click();
    }, 500);
  }

  editReviewSetting() {
    console.log(this.editReviewSettingForm.value);
    this.isReview = this.editReviewSettingForm.value.isReview;

    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);

    this.manageProfileStorage.groupDetails.is_reviews = this.isReview;

    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );
    setTimeout(() => {
      $('#editReviewSetting_cancel').click();
    }, 1000);
  }

  // Edit upload and remove Conversation Image //

  editConversations() {
    // set the updated value in manageProfileStorage storage //
    this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
    this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
    this.isConversations = this.editConversationsForm.value.isConversations;
    this.manageProfileStorage.groupDetails.is_conversations =
      this.editConversationsForm.value.isConversations;
    this.manageProfileStorage.groupDetails.group_conversation_images =
      this.uploadUrls;

    this.manageProfileStorage.groupDetails.conversationImagesCode =
      this.conversationImagesCode;

    localStorage.setItem(
      'manageProfileStorage',
      JSON.stringify(this.manageProfileStorage)
    );

    // end  update storage
    setTimeout(() => {
      $('#editConversations_cancel').click();
    }, 1000);
  }

  showConversationImages() {
    for (var i = 0; i <= this.conversationImages.length - 1; i++) {
      let id = this.conversationImages[i].id;
      let image = this.conversationImageUrl + this.conversationImages[i].image;
      this.uploadUrls.push({ id: id, image: image });
    }
    this.conversationNum = this.conversationImages.length;
    if (this.conversationNum >= 3) {
      this.conversationNum = 3;
    }
  }

  uploadImages(event: any) {
    this.files = event.target.files;
    for (var i = 0; i <= this.files.length - 1; i++) {
      let Imagesize = 3000000;
      if (Imagesize <= this.files[i].size) {
        this.msgs = [
          {
            severity: 'warn',
            summary: 'Warning',
            detail: 'Image size should be less than 3 Mb ',
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
          this.urls.push(e.target.result);
          this.conversationImagesCode.push(e.target.result);
        };
        reader.readAsDataURL(this.files[i]);
        var selectedFile = event.target.files[i];
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
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

    if (
      this.uploadUrls[uploadUrlIndex].image.indexOf('/conversationImages/') > 0
    ) {
      let imageArray = this.uploadUrls[uploadUrlIndex].image.split(
        '/conversationImages/'
      );
      this.image = {};
      this.image.id = id;
      this.image.image = imageArray[1];
      this.removeImage.push(this.image);
    }

    this.uploadUrls.splice(uploadUrlIndex, 1);
    if (fileListIndex >= 0) {
      this.fileList.splice(fileListIndex, 1);
    }
  }

  // End Edit upload and remove Conversation Image//

  editReviews() {
    this.rating = this.editReviewsForm.value.rating;
    this.review = this.editReviewsForm.value.review;
    setTimeout(() => {
      $('#editReviews_close').click();
    }, 1000);
  }
  // Uplaoad Group image with validation & show error in message toaster
  uploadGroupImages(event: any) {
    this.groupFile = event.target.files[0];
    let Imagesize = 5000000;
    if (Imagesize <= this.groupFile.size) {
      this.msgs = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail: 'Image size should be less than 5 Mb ',
        },
      ];
    } else if (
      this.groupFile.type != 'image/jpeg' &&
      this.groupFile.type != 'image/png' &&
      this.groupFile.type != 'image/jpg'
    ) {
      this.msgs = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail: 'Image type should be ( jpeg | jpg | png ) ',
        },
      ];
    } else {
      this.uploadedImageName = event.target.files[0].name;
      let objectURL = URL.createObjectURL(event.target.files[0]);
      this.groupImage = objectURL;
      this.manageProfileStorage = localStorage.getItem('manageProfileStorage');
      this.manageProfileStorage = JSON.parse(this.manageProfileStorage);
      this.manageProfileStorage.groupDetails.image = this.groupImage;
      this.manageProfileStorage.groupDetails.uploadImageName =
        this.uploadedImageName;
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.groupImageCode = reader.result;
          this.manageProfileStorage.groupDetails.baseCodeimage =
            this.groupImageCode;
        };
      }
      setTimeout(() => {
        localStorage.setItem(
          'manageProfileStorage',
          JSON.stringify(this.manageProfileStorage)
        );
      }, 500);
    }
    setTimeout(() => {
      this.msgs = [];
    }, 3000);
  }

  /* OPEN ADMIN BIO PREVIEW */
  openPreview() {
    $('#manage-create').closest('body').addClass('hide-scroll');
    this.setPublishGroupStorage();
    let url = new URL(window.location.href);
    let pathnamArray = url.pathname.split('/');

    console.log(pathnamArray);
    let dynamicUrl = '/group-profile/';
    if (pathnamArray.length > 2) {
      dynamicUrl = '/' + pathnamArray[1] + '/group-profile/';
    }

    let urlPreview =
      this.origin +
      dynamicUrl +
      this.uniqueName +
      '?displayClose=true&preview=true&manage=true';
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
    }
    // create storage to publish form from preview publish button
    this.publishGroup.categoryId = this.selectedCategory;
    this.publishGroup.description = this.description;
    this.publishGroup.locationId = this.selectedLocation;
    this.publishGroup.uniqueName = this.uniqueName;
    this.publishGroup.isTopic = this.isTopic;
    this.publishGroup.topic = this.topics;
    this.publishGroup.isConversations = this.isConversations;
    this.publishGroup.isReview = this.isReview;
    this.publishGroup.removeImage = JSON.stringify(this.removeImage);
    this.publishGroup.profile_id = this.id;
    this.publishGroup.group_id = this.groupId;
    this.publishGroup.fb_group_id = this.facebookGroupId;
    localStorage.setItem('publishGroup', JSON.stringify(this.publishGroup));
    //end
  }

  publishProfile() {
    this.updateGroupProfile();
  }

  updateGroupProfile() {
    this.publishButtonText = 'Processing....';
    const formData: FormData = new FormData();
    formData.append('categoryId', this.selectedCategory);
    formData.append('description', this.description);
    formData.append('locationId', this.selectedLocation);
    formData.append('uniqueName', this.uniqueName);
    formData.append('isTopic', this.isTopic.toString());
    formData.append('topic', this.topics);
    formData.append('isConversations', this.isConversations.toString());
    formData.append('removeImage', JSON.stringify(this.removeImage));
    formData.append('profile_id', this.id);
    this.status = 1;
    formData.append('status', this.status);
    formData.append('isReview', this.isReview.toString());
    formData.append('previousGroupImage', this.previousGroupImage);
    formData.append('groupImage', this.groupFile);

    let imagesArray = this.fileList;
    for (let image of imagesArray) {
      formData.append('images[]', image);
    }

    formData.append('group_id', this.groupId);
    formData.append('fb_group_id', this.facebookGroupId);

    this.apiService
      .updateManageProfile(this.token, formData)
      .subscribe((response: any) => {
        this.publishButtonText = 'Publish Profile';
        if (response.status == 200) {
          this.displayPublishModel = true;
        }
      });
  }

  closePublishModel() {
    setTimeout(() => {
      this.router.navigate(['/group-profiles']);
    }, 500);
  }
}
