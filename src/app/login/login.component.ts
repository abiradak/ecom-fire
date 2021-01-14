import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  adminCredential: any = {
    username: 'admin',
    password: 'admin@123'
  };
  login: FormGroup;
  loadPage = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private location: Location
  ) {
    this.login = this.fb.group({
      username: new FormControl(null , [Validators.required]),
      password: new FormControl(null , [Validators.required]),
      // remember: new FormControl(null , [])
    });
  }

  ngOnInit(): void {
    if (this.checkLogin()) {
      // this.router.navigate(['dashboard']);
      this.location.back();
    } else {
      this.loadPage = true;
    }
  }

  checkLogin(): boolean {
    let isLogin = false;

    if (localStorage.getItem('loginData')) {
      const loginData = JSON.parse(localStorage.getItem('loginData'));
      isLogin = loginData.isLogin;
    }
    // console.log('checkLogin isLogin: ', isLogin);

    return isLogin;
  }

  async submitLogin(): Promise<void> {
    if (this.login.valid) {
      if (this.login.value.username === this.adminCredential.username && this.login.value.password === this.adminCredential.password) {
        localStorage.setItem('loginData', JSON.stringify({
          isLogin: true,
        }));
        this.router.navigate(['dashboard']);
      } else {
        this.dataService.showError('Credential not matched'); // --- Display error message
      }
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.login.controls).forEach((field) => {
        const control = this.login.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

}
