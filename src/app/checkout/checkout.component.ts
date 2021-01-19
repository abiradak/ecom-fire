import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cart: {};
  subTotal: number;
  userDetails: any = {};
  address: any;
  hidden = false;
  isLoading = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.getCartData();
    this.getUserDetails();
  }

  getCartData(): void {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart !== null) {
      this.calculation();
    }
  }

  calculation(): void {
    this.subTotal = 0;
    if (this.cart !== null) {
      // tslint:disable-next-line: no-string-literal
      this.cart['items'].forEach(element => {
        this.subTotal = (element.quantity * element.product.price) + this.subTotal;
      });
    }
  }

  getUserDetails() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
  }

  changeAddress() {
    this.hidden = true;
    this.isLoading = true;
    if (this.address !== null) {
      const payLoad = {
        address: this.address,
        userid: this.userDetails.id
      };
      this.api.sendHttpCall(payLoad, `address/add` , 'post').pipe().subscribe( (res) => {
        console.log('product >>>>', res);
        if (res.status === 200) {
          this.data.presentToast(res.message, 'success');
        }
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
        console.log('>>>>>>>' , err);
      });
    }
  }

  dispatch() {
    this.isLoading = true;
    const payLoad = {
      userid: this.userDetails.id,
      // tslint:disable-next-line: no-string-literal
      items: this.cart['items'],
      totalprice: this.subTotal,
      status: 'Pending',
      daddress: this.address,
    };
    this.api.sendHttpCall(payLoad, `order/add` , 'post').pipe().subscribe( (res) => {
      console.log('order add response >>>>', res);
      if (res.status === 200) {
        this.data.presentToast(res.message, 'success');
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log('>>>>>>>' , err);
    });

    // this.router.navigate(['thankyou']);
  }
}
