import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  currentTab = 1;
  profileData = null;
  userId: string = null;
  loadPage = false;
  userForm: FormGroup;
  nameValidationRegex: any;
  emailValidationRegex: any;
  phoneValidationRegex: any;
  showloader = false;
  imageError: string;
  isImageSaved = false;
  isImageChanged = false;
  cardImageBase64: string = null;
  isEditable = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
    private globalService: GlobalService,
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.emailValidationRegex = this.dataService.emailValidationRegex;
    this.phoneValidationRegex = this.dataService.phoneValidationRegex;

    this.userForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      fullname: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailValidationRegex)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.phoneValidationRegex)]),
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('loginData')) {
      this.profileData = JSON.parse(localStorage.getItem('loginData'));
      console.log('this.profileData: ', this.profileData);
      this.populateData();
      this.disbledInputs();
    }
  }

  populateData(): void {
    this.userId = this.profileData.id;
    if (this.profileData.image !== null || this.profileData.image !== '') {
      this.cardImageBase64 = this.profileData.image;
      this.isImageSaved = true;
    }
    this.userForm.patchValue({
      fullname: this.profileData.name,
      email: this.profileData.email,
      phone: this.profileData.phone,
    });
  }

  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    this.cardImageBase64 = this.profileData.image;
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
            this.isImageChanged = true;
            // console.log('this.cardImageBase64: ', this.cardImageBase64);
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  disbledInputs(): void {
    this.isEditable = false;
    this.userForm.controls.fullname.disable();
    this.userForm.controls.email.disable();
    this.userForm.controls.phone.disable();
  }

  enabledInputs(): void {
    this.isEditable = true;
    this.userForm.controls.fullname.enable();
    this.userForm.controls.email.enable();
    this.userForm.controls.phone.enable();
  }

  removeImage(element): void {
    if (this.profileData.image !== null || this.profileData.image !== '') {
      this.cardImageBase64 = this.profileData.image;
      this.isImageSaved = true;
      this.isImageChanged = false;
      element.value = '';
    } else {
      this.cardImageBase64 = null;
      this.isImageSaved = false;
      this.isImageChanged = false;
      element.value = '';
    }
  }

  changeTab(currentTab): void {
    this.currentTab = currentTab;
  }

  async submitUser(element): Promise<void> {
    if (this.userForm.valid && this.cardImageBase64 !== null) {
      const credentials = {
        name: this.userForm.value.fullname,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        image: this.cardImageBase64,
      };
      // console.log('submitUser credentials: ', credentials);
      const url  = `/user/edit/` + this.userId;
      this.showloader = true;

      this.apiService.sendHttpCallWithToken(credentials , url , 'patch').subscribe(response => {
        // console.log('submitUser response: ', response);
        this.showloader = false;
        if (response.status === 200) {
            this.dataService.showSuccess(response.message);
            this.profileData.image = this.cardImageBase64;
            this.profileData.name = this.userForm.value.fullname;
            this.profileData.email = this.userForm.value.email;
            this.profileData.phone = this.userForm.value.phone;
            this.isImageChanged = false;
            this.disbledInputs();
            localStorage.setItem('loginData', JSON.stringify(this.profileData));
            this.globalService.publishSomeData({
              changename: this.userForm.value.fullname,
            });
            element.value = '';
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to edit profile');
        }
      }, (error) => {
        this.showloader = false;
        console.log('submitUser error: ' , error);
        this.dataService.showError('Unable to edit profile, please check your internet');
        // if (error.message) {
        //   this.dataService.showError(error.message);
        // } else {
        //   this.dataService.showError('Unable to edit profile, please check your internet');
        // }
      });
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
