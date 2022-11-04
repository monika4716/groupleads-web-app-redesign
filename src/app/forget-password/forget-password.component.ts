import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  credential: any = FormGroup;
  submitted: any = false;
  send_Email: any;
  send_Email_Message: any;
  verifying: boolean = false;
  EmailSuccess: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.credential = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}
  get f() {
    if (this.credential.controls.email.errors) {
      this.send_Email_Message = '';
      this.send_Email = '';
    }
    return this.credential.controls;
  }

  onChange() {
    if (this.send_Email == false) {
      this.send_Email = '';
      this.send_Email_Message = '';
    }
  }
  sendEmail() {
    this.verifying = true;
    this.submitted = true;
    if (this.credential.invalid) {
      this.verifying = false;
      return;
    }
    this.apiService.forgetpassword(this.credential.value).subscribe(
      (response: any) => {
        if (response['status'] == 404) {
          this.verifying = false;
          this.send_Email =
            response['message'] == 'Email not found.' ? false : true;
          this.send_Email_Message = response['message'] || response['msg'];
          setTimeout(() => {
            this.send_Email = true;
            this.send_Email_Message = '';
          }, 2000);
          console.log(response);
        } else if (response['status'] == 200) {
          this.verifying = false;
          this.send_Email =
            response['mesage'] == 'Please enter a valid email.' ? false : true;
          this.send_Email_Message = response['message'] || response['msg'];
          this.EmailSuccess = true;
          console.log(response);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
