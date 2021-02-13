import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { EventEmitterService } from '../services/event-emitter.service';


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
    private route: Router,
    private event: EventEmitterService
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
      // tslint:disable-next-line: no-string-literal
      this.cart['items'].forEach(element => {
        this.subTotal = (element.quantity * element.product.price) + this.subTotal;
      });
    }
    console.log('>>>>>', this.subTotal);
  }

  checkout() {
    const isLogin = this.dataService.isLogin();
    if (isLogin === true) {
      // this.route.navigate(['login']);
      this.proceed();
    } else {
      this.route.navigate(['login']);
    }
  }

  updateCart(index: number, updateType: string): void {
    // tslint:disable-next-line: no-string-literal
    let currentQty = this.cart['items'][index].quantity;
    if (updateType === 'add') {
      currentQty++;
      // tslint:disable-next-line: no-string-literal
      this.cart['items'][index].quantity = currentQty;
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.getCartData();
    } else {
      if (currentQty > 1) {
        currentQty--;
        // tslint:disable-next-line: no-string-literal
        this.cart['items'][index].quantity = currentQty;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.getCartData();
      }
    }
    this.event.onCartAdd();
    this.dataService.presentToast('cart updated', 'success');
  }

  deleteFromCart(index: number): void {
    // tslint:disable-next-line: no-string-literal
    this.cart['items'].forEach(element => {
      // tslint:disable-next-line: no-string-literal
      if (this.cart['items'].indexOf(element) === index) {
        // tslint:disable-next-line: no-string-literal
        this.cart['items'].splice(index, 1);
      }
    });
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.dataService.presentToast('Item Removed', 'success');
    this.getCartData();
    this.event.onCartAdd();
  }

  proceed() {
    // tslint:disable-next-line: no-string-literal
    if (this.cart && this.cart['items'].length > 0) {
      this.route.navigate(['checkout']);
    } else {
      this.dataService.presentToast('Cart is Empty!', 'warning');
    }
  }
}
