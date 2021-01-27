import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string = null;
  orderData: any;
  showloader = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId');
    // console.log('this.orderId: ', this.orderId);
    if (this.orderId.length === 0) {
      this.dataService.showError('Order details not found.'); // --- Display error message
      this.router.navigate(['/orders']);
    } else {
      this.getOrderDetailsFromAPI();
    }
  }

  async getOrderDetailsFromAPI(): Promise<void> {
    const url = 'order/' + this.orderId;
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getOrderDetailsFromAPI response: ' , response);
      this.showloader = false;
      this.orderData = response;
      // console.log('this.orderData: ', this.orderData);
    }, (error) => {
      console.log('getOrderDetailsFromAPI error: ' , error);
      this.showloader = false;
      if (error.message) {
        this.dataService.showError(error.message);
      } else {
        this.dataService.showError('Unable to load order details!');
      }
      this.router.navigate(['/brand-list']);
    });
  }

}
