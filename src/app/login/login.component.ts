import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta } from '@angular/platform-browser';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials: any = FormGroup;
  error = false;
  verifying: boolean = false;
  token: any;
  notCheck: any;
  submitted = false;
  error_Message: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private meta: Meta,
    private apiService: ApiService
  ) {
    this.token = localStorage.getItem('token');
    this.credentials = this.formBuilder.group({
      KeepMeLoggedIn: '',
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    if (this.token) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['']);
      localStorage.removeItem('token');
    }

    if (document.cookie) {
      if (
        document.cookie.split(';')[0].split('=')[0] == 'email' ||
        document.cookie.split(';')[1].split('=')[1] == 'password'
      ) {
        this.notCheck = false;
        this.credentials.value.email = document.cookie
          .split(';')[0]
          .split('=')[1];
        this.credentials.value.password = document.cookie
          .split(';')[1]
          .split('=')[1];
        this.loginUser();
      }
    }
  }

  ngOnInit(): void {
    this.meta.addTags([
      { name: 'title', content: 'Group Leads Log In : Group Leads' },
    ]);

    if (this.token) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['']);
      localStorage.removeItem('token');
    }
    if (document.cookie) {
      if (
        document.cookie.split(';')[0].split('=')[0] == 'email' ||
        document.cookie.split(';')[1].split('=')[1] == 'password'
      ) {
        this.notCheck = false;
        this.credentials.value.email = document.cookie
          .split(';')[0]
          .split('=')[1];
        this.credentials.value.password = document.cookie
          .split(';')[1]
          .split('=')[1];
        this.loginUser();
      }
    }
  }
  get f() {
    return this.credentials.controls;
  }
  loginUser() {
    this.verifying = true;
    this.submitted = true;
    if (this.notCheck == true) {
      if (this.credentials.invalid) {
        this.verifying = false;
        return;
      }
    }
    this.spinner.show();
    this.apiService.loginUser(this.credentials.value).subscribe(
      (response: any) => {
        // console.log(response);
        if (response['status'] == 400 || response['status'] == 404) {
          this.verifying = false;
          this.error = true;
          this.error_Message = response['message'];
          this.spinner.hide();
        } else if (response['status'] == 200) {
          console.log(this.credentials.value.KeepMeLoggedIn);
          if (this.credentials.value.KeepMeLoggedIn) {
            var now = new Date();
            var time = now.getTime();
            var expireTime = time + 7 * 24 * 60 * 60 * 1000;
            console.log(expireTime);
            console.log(now.setTime(expireTime));
            now.setTime(expireTime);
            document.cookie =
              'email=' +
              this.credentials.value.email +
              ';expires=' +
              now.toUTCString() +
              ';path=/';
            document.cookie =
              'password=' +
              this.credentials.value.password +
              ';expires=' +
              now.toUTCString() +
              ';path=/';
          }
          this.error = false;
          var token = response['token'];
          //console.log(response['token']);
          localStorage.setItem('token', token);
          var name = response['user'].name;
          localStorage.setItem('name', name);
          this.router.navigate(['dashboard']);
        }
      },
      (err) => {
        //console.log(err);
      }
    );
  }
}
