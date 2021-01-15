import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.scss'],
})
export class ViewcartComponent implements OnInit {
  cart = {};
  subTotal: number;

  constructor(
    private dataService: DataService,
    private route: Router
  ) { }

  ngOnInit() {
    this.getCartData();
  }

  back() {
    this.dataService.goBack();
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

  checkout() {
    const isLogin = this.dataService.isLogin();
    if (isLogin === true) {
      this.proceed();
    } else {
      this.route.navigate(['login']);
    }
  }

  updateCart(index: number, updateType: string): void {
    console.log('>>>>', index);
    let currentQty = this.cart['items'][index].quantity;
    if (updateType === 'add') {
      currentQty++;
      this.cart['items'][index].quantity = currentQty;
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.getCartData();
    } else {
      if (currentQty > 1) {
        currentQty--;
        this.cart['items'][index].quantity = currentQty;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getCartData();
      }
    }
    this.dataService.presentToast('cart updated', 'success');
  }

  deleteFromCart(index: number): void {
    this.cart['items'].forEach(element => {
      if (this.cart['items'].indexOf(element) === index) {
        this.cart['items'].splice(index, 1);
      }
    });
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.dataService.presentToast('Item Removed', 'success');
    this.getCartData();
  }

  proceed() {
    this.route.navigate(['checkout']);
  }

}
