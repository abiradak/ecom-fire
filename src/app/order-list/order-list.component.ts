import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public orderList: any = [];
  dtOptions: DataTables.Settings = {};
  showloader = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.getOrderFromApi();
  }

  async getOrderFromApi(): Promise<void> {
    const url = 'pendingorders';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getOrderFromApi response: ' , response);
      this.showloader = false;
      if (response.orders && response.orders.length > 0) {
        this.orderList = response.orders;
      } else {
        this.orderList = [];
        this.dataService.showError('No order found!');
      }
      // console.log('this.orderList: ', this.orderList);
    }, (error) => {
      console.log('getOrderFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load order list!');
    });
  }

  viewDetails(orderId): void {
    this.router.navigate(['/order-details/' + orderId]);
  }

}
