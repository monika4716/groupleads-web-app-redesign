import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../api.service';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-group-plugin-create',
  templateUrl: './group-plugin-create.component.html',
  styleUrls: ['./group-plugin-create.component.css'],
})
export class GroupPluginCreateComponent implements OnInit {
  token: any;
  href: any;
  pluginWordpressForm!: FormGroup;
  pluginHtmlForm!: FormGroup;
  submitted = false;
  isSnippetDisable: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;
    if (this.href.indexOf('/plugin/create') > -1) {
      setTimeout(() => {
        $('.group-plugin').find('a').addClass('active');
      }, 500);
    }

    //from validation
    this.pluginWordpressForm = this.fb.group({
      website_name: ['', Validators.required],
      website_url: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
          ),
        ],
      ],
      app_id: ['', Validators.required],
      facebook_url: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
          ),
        ],
      ],
      social_context: [''],
      meta_context: [''],
      theme_color: [''],
      plugin_width: ['', Validators.required],
    });

    this.pluginHtmlForm = this.fb.group({});
  }

  get wf() {
    //console.log(this.pluginWordpressForm.controls);
    return this.pluginWordpressForm.controls;
  }
  get hf() {
    //console.log(this.pluginHtmlForm.controls);
    return this.pluginHtmlForm.controls;
  }

  onSubmitWordpressFrom() {}

  onSubmitHtmlFrom() {
    //     is_plugin
    // user_id
    // plugin_type
    // website_name
    // website_url
    // fb_app_id
    // fb_group_url
    // social_context
    // meta_context
    // theme_color
    // banner_width
    // display_type
    // display_position
  }
}
