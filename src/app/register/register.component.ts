import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  register: FormGroup

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private data: DataService,
    private router: Router
  ) { 
    this.register = this.fb.group({
      name: new FormControl(null , [Validators.required , Validators.maxLength(50), Validators.minLength(2) , Validators.pattern(/^[a-zA-Z ]*$/)]),
      email: new FormControl( null, [Validators.required,  Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]),
      password: new FormControl( null , [Validators.required]),
      mobile: new FormControl(null , [Validators.required , Validators.maxLength(10), Validators.minLength(10) , Validators.pattern(/^[6-9]\d{9}$/)])
    })
  }

  ngOnInit() {
    
  }

  submit() {
    if (this.register.valid) {
      const payLoad = {
        name: this.register.value.name,
        phone:this.register.value.mobile,
        email: this.register.value.email,
        password: this.register.value.password,
        image: ''
      }
      this.api.sendHttpCall(payLoad , 'user/add' , 'post').pipe().subscribe((res) => {
        console.log('>>>>>>>>', res);
        if (res.status === 200) {
          this.data.presentToast(res.message, 'success');
          this.router.navigate(['home']);
        } else {
          this.data.presentToast(res.message, 'danger');
        }
      })
    } else {
      Object.keys(this.register.controls).forEach((field) => {
        const control = this.register.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

}
