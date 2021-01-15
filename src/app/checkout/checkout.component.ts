import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cart: {};
  subTotal: number;
  userDetails: {};
  address: any;
  hidden = false;

  constructor(
    private router: Router
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
  }

  dispatch() {
    this.router.navigate(['thankyou']);
  }
}
