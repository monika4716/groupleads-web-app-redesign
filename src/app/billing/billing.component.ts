import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  planDetails: any;
  planFeatures: any = [];
  token: any;
  billingIdBollean: boolean = false;
  showUpGradeBtn: boolean = true;
  billingId: any;
  expireDate: any;
  dayleft: any;
  upgradeURL: any;
  trial: any;
  price: string = '';
  type: string = '';
  planDetail: any = {};
  leftRowsCount: any;
  email: any;
  buttonText = 'Copy URL';

  billingCycleSection: boolean = true;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.apiService.billingDetails(this.token).subscribe(
      (response: any) => {
        console.log(response);
        this.upgradeURL = 'https://groupleads.net/plans/?hash=' + response.hash;
        if (response['status'] == 404) {
        } else if (response['status'] == 200) {
          this.planFeatures = response.userDetails.features;
          this.leftRowsCount = Math.ceil(this.planFeatures.length / 2);
          this.price = response.userDetails.price;
          this.email = response.userDetails.email;
          this.type = response.type;
          this.planDetail = response;
          this.trial = this.planDetail.userDetails.trial;

          if (this.planDetail.userDetails.expired_on == null) {
            this.billingCycleSection = false;
          }

          this.billingId = response['userDetails'].plan_id;

          if (response['userDetails'].expired_on != null) {
            this.expireDate = moment(response['userDetails'].expired_on).format(
              'MMMM Do YYYY'
            );
            var expireDate = moment(response['userDetails'].expired_on).format(
              'MM/DD/YYYY'
            );
            var todaydate = moment(new Date()).format('MM/DD/YYYY');
            this.dayleft = moment(expireDate).diff(moment(todaydate), 'days');
          }

          if (response.reseller_id > 0 || response.type == 'life_time') {
            //admin
            this.showUpGradeBtn = false;
          } else {
            this.showUpGradeBtn = true;
          }
        }
        this.spinner.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  copyUrl() {
    console.log(this.upgradeURL);
    this.buttonText = 'Copied URL';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.upgradeURL).then(
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
      this.buttonText = 'Copy URL';
    }, 2000);
  }

  toggleSideBar() {
    console.log('here');
    $('body').toggleClass('open-sidebar1');
  }
}
