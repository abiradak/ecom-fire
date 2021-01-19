import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  cart: any;
  quantity: any;
  user: any;

  constructor(
    private data: DataService,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.isLogin();
    this.getCart();
  }

  isLogin() {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }
  openMenu() {
    console.log('ajdahbd');
    this.menuController.open();
  }

  getCart(): void {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    this.quantity = 0;
    if (this.cart !== null) {
      this.cart.items.forEach((element: any) => {
        this.quantity = this.quantity + element.quantity;
      });
    }
  }
}
