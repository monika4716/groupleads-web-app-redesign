import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';

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
    private apiService: ApiService,
    private clipboardService: ClipboardService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.apiService.billingDetails(this.token).subscribe(
      (response: any) => {
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

  /* Copy Billing Url */
  copyBillingUrl() {
    this.buttonText = 'Copied URL';
    this.clipboardService.copyFromContent(this.upgradeURL);
    setTimeout(() => {
      this.buttonText = 'Copy URL';
    }, 2000);
  }
}
