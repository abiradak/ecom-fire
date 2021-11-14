import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import {Location} from '@angular/common';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loadPage = false;
  userForm: FormGroup;
  emailValidationRegex: any;
  passwordValidationRegex: any;
  showloader = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
    private globalService: GlobalService,
    private router: Router,
    private location: Location
  ) {
    this.emailValidationRegex = this.dataService.emailValidationRegex;
    this.passwordValidationRegex = this.dataService.passwordValidationRegex;

    this.userForm = this.fb.group({
      email: new FormControl('' , [Validators.required, Validators.pattern(this.emailValidationRegex)]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl(null , [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern(this.passwordValidationRegex)]),
    });
  }

  ngOnInit(): void {
    if (this.dataService.checkLogin()) {
      // this.router.navigate(['dashboard']);
      this.location.back();
    } else {
      this.loadPage = true;
    }
  }

  async loginUser(): Promise<void> {
    if (this.userForm.valid) {
      const credentials = {
        email: this.userForm.value.email,
        password: this.userForm.value.password,
      };
      // console.log('loginUser credentials: ', credentials);
      const url  = `/login`;
      this.showloader = true;
      localStorage.setItem('loginData', JSON.stringify(credentials));
      this.globalService.publishSomeData({
        isLoggedin: true,
      });
      this.router.navigate(['check-out']);

      // this.apiService.sendHttpCallWithToken(credentials , url , 'post').subscribe(response => {
      //   // console.log('loginUser response: ', response);
      //   this.showloader = false;
      //   if (response.status === 200) {
      //     this.dataService.showSuccess(response.message);
      //     // this.dataService.showSuccess('Login successful');
      //     if (response.data) {
      //       localStorage.setItem('loginData', JSON.stringify(response.data));
      //       this.router.navigate(['check-out']);
      //       this.globalService.publishSomeData({
      //         isLoggedin: true,
      //       });
      //     } else {
      //       this.dataService.showError('User details not found');
      //     }
      //   } else if (response.status === 400) {
      //     this.dataService.showError(response.message);
      //   } else {
      //     this.dataService.showError('Unable to register');
      //   }
      // }, (error) => {
      //   this.showloader = false;
      //   console.log('loginUser error: ' , error);
      //   this.dataService.showError('Unable to login');
      //   // if (error.message) {
      //   //   this.dataService.showError(error.message);
      //   // } else {
      //   //   this.dataService.showError('Unable to register, please check your internet');
      //   // }
      // });
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

}
