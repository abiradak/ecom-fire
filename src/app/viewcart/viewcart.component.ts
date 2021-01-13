import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.scss'],
})
export class ViewcartComponent implements OnInit {
  cart = {};
  subTotal: number;

  constructor() { }

  ngOnInit() {
    this.getCartData();
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
    console.log('>>>>>', this.subTotal);
  }
}
