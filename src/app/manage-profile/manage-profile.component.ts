import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {
  origin: any;
  groupSlug: any;
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
      .subscribe((response: any) => {});
  }
}
