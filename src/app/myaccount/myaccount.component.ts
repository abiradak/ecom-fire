import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent implements OnInit {
  user = {};

  constructor(
    private dataSer: DataService
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  back() {
    this.dataSer.goBack();
  }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }

}
