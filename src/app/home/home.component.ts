import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any;
  cart: any;
  quantity: any;

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  slideOpts1 = {
    loop: true,
    autoplay: true,
    slidesPerView: 1,
    initialSlide: 1,
    speed: 400
  };

  ngOnInit() {
    this.getCategories();
    this.getCart();
  }

  async getCategories(): Promise<void> {
    this.api.sendHttpCall('' , 'catagories' , 'get').pipe().subscribe( (res) => {
      this.categories = res.category;
      console.log('>>>>>>', this.categories);
    }, (err) => {
      console.log('>>>>>>>' , err);
    });
  }

  getCart(): void {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    this.quantity = 0;
    if (this.cart !== null) {
      this.cart.items.forEach(element => {
        this.quantity = this.quantity + element.quantity;
      });
    }
  }

  goToCate(item) {
    this.router.navigate(['item-category', item]);
  }

}
