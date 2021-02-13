import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { EventEmitterService } from '../services/event-emitter.service';

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
    private menuController: MenuController,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit() {
    this.isLogin();
    this.getCart();
    // this.data.currentMessage.subscribe((qty) => {
    //   console.log('qty', qty);
    // });

    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeCartFunction
      .subscribe((name: string) => {
        this.getCart();
      });
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeLoginSuccess
      .subscribe((name: string) => {
        this.isLogin();
      });
    }
  }

  isLogin(): void {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }
  openMenu() {
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
