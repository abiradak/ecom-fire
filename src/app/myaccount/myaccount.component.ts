import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent implements OnInit {
  user = {};
  orders = [];
  isLoading = false;

  constructor(
    private dataSer: DataService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.getUserDetails();
    this.getOrders();
  }

  back() {
    this.dataSer.goBack();
  }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }

  async getOrders(): Promise<void> {
    this.isLoading = true;
    // tslint:disable-next-line: no-string-literal
    this.api.sendHttpCall('' , `order/${this.user['id']}` , 'get').pipe().subscribe( (res) => {
      this.orders = res.orders;
      console.log('order >>>>>>', this.orders);
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log('>>>>>>>' , err);
    });
  }
}
