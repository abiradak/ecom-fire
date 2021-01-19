import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loadPage = false;
  userForm: FormGroup;
  nameValidationRegex: any;
  emailValidationRegex: any;
  phoneValidationRegex: any;
  passwordValidationRegex: any;
  showloader = false;
  acceptTandC = false;
  imageError: string;
  isImageSaved = false;
  cardImageBase64: string = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.emailValidationRegex = this.dataService.emailValidationRegex;
    this.phoneValidationRegex = this.dataService.phoneValidationRegex;
    this.passwordValidationRegex = this.dataService.passwordValidationRegex;

    this.userForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      fullname: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)]),
      email: new FormControl('' , [Validators.required, Validators.pattern(this.emailValidationRegex)]),
      phone: new FormControl('' , [Validators.required, Validators.pattern(this.phoneValidationRegex)]),
      // tslint:disable-next-line:max-line-length
      password: new FormControl(null , [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern(this.passwordValidationRegex)]),
      // tslint:disable-next-line:max-line-length
      confPassword: new FormControl(null , [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern(this.passwordValidationRegex)]),
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

  changeAcceptTandC(): void {
    if (this.acceptTandC) {
      this.acceptTandC = false;
    } else {
      this.acceptTandC = true;
    }
    // console.log('Accepts T&C status: ', this.acceptTandC);
  }

  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // -- Size Filter Bytes
      const maxSize = 20971520;
      const allowedTypes = ['image/png', 'image/jpeg'];
      const maxHeight = 15200;
      const maxWidth = 25600;

      if (fileInput.target.files[0].size > maxSize) {
        this.imageError = 'Maximum size allowed is ' + maxSize / 1000 + 'Mb';
        return false;
      }

      if (!_.includes(allowedTypes, fileInput.target.files[0].type)) {
        this.imageError = 'Only images are allowed(JPG, PNG)';
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const height = 'height';
          const width = 'height';
          const imgHeight = rs.currentTarget[height];
          const imgWidth = rs.currentTarget[width];
          // console.log('imgHeight, imgWidth: ', imgHeight, imgWidth);

          if (imgHeight > maxHeight && imgWidth > maxWidth) {
            this.imageError = 'Maximum dimentions allowed ' + maxHeight + '*' + maxWidth + 'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            // console.log('this.cardImageBase64: ', this.cardImageBase64);
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(element): void {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    element.value = '';
  }

  async submitUser(): Promise<void> {
    if (this.userForm.valid && this.cardImageBase64 !== null) {
      if (this.acceptTandC === false) {
        this.dataService.showError('Please select terms and condition'); // --- Display error message
      } else if (this.userForm.value.password !== this.userForm.value.confPassword) {
        this.dataService.showError('Confirm password not matched'); // --- Display error message
      } else {
        const credentials = {
          name: this.userForm.value.fullname,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          password: this.userForm.value.password,
          image: this.cardImageBase64,
        };
        // console.log('submitUser credentials: ', credentials);
        const url  = `/user/add`;
        this.showloader = true;

        this.apiService.sendHttpCallWithToken(credentials , url , 'post').subscribe(response => {
          // console.log('submitUser response: ', response);
          this.showloader = false;
          if (response.status === 200) {
            // this.dataService.showSuccess(response.message);
            this.dataService.showSuccess('Register successful');
            this.router.navigate(['/login']);
          } else if (response.status === 400) {
            this.dataService.showError(response.message);
          } else {
            this.dataService.showError('Unable to register');
          }
        }, (error) => {
          this.showloader = false;
          console.log('submitUser error: ' , error);
          this.dataService.showError('Unable to register, please check your internet');
          // if (error.message) {
          //   this.dataService.showError(error.message);
          // } else {
          //   this.dataService.showError('Unable to register, please check your internet');
          // }
        });
      }
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
