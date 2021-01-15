import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private data: DataService,
    private router: Router
  ) {
    this.login = this.fb.group({
      email: new FormControl( null, [Validators.required,  Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]),
      password: new FormControl(null , [Validators.required])
    })
  }

  ngOnInit() {}

  submit() {
    if (this.login.valid) {
      const payLoad = {
        email: this.login.value.email,
        password: this.login.value.password
      }
      this.api.sendHttpCall(payLoad , 'login' , 'post').pipe().subscribe((res) => {
        console.log('>>>>>>>>', res);
        if (res.status === 200) {
          localStorage.setItem('userDetails', JSON.stringify(res.data));
          this.data.presentToast(res.message, 'success');
          this.router.navigate(['home']);
        } else {
          this.data.presentToast(res.message, 'danger');
        }
      })
    } else {
      Object.keys(this.login.controls).forEach((field) => {
        const control = this.login.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

}
