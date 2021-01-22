import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})
export class ViewCartComponent implements OnInit {

  currency;
  cartProducts = [];
  subTotal = 0;
  total = 0;

  constructor(
    private dataService: DataService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.currency = this.dataService.currency;
  }

  ngOnInit(): void {
    this.cartProducts = this.dataService.getCartItem();
    console.log('this.cartProducts: ', this.cartProducts);
    this.calculatetotal();
  }

  updateCart(index, updateType): void {
    let currentQty = this.cartProducts[index].quantity;
    if (updateType === 'add') {
      currentQty++;
      this.cartProducts[index].quantity = currentQty;
      this.dataService.setCartItem(this.cartProducts);
    } else {
      if (currentQty > 1) {
        currentQty--;
        this.cartProducts[index].quantity = currentQty;
        this.dataService.setCartItem(this.cartProducts);
      }
    }
    this.calculatetotal();
    // console.log('updateCart cartProducts: ', this.cartProducts);
  }

  removeFromCart(index): void {
    this.cartProducts.splice(index, 1);
    this.dataService.setCartItem(this.cartProducts);
    this.calculatetotal();
    this.globalService.publishSomeData({
      updateCart: true,
    });
    this.dataService.showInfo('Product removed from cart');
  }

  calculatetotal(): void {
    this.subTotal = 0;
    this.cartProducts.forEach(element => {
      this.subTotal += +element.data.price * element.quantity;
    });
    this.total = this.subTotal + this.subTotal * 0.1; // 10% Tax
  }

  checkout(): void {
    if (this.dataService.checkLogin()) {
      this.router.navigate(['check-out']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
