import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any;
  cart: any;
  quantity: any;
  catEnd = 1;
  isCollapse = true;
  itemCount = 1;

  constructor(
    private api: ApiService,
    private router: Router,
    private dataService: DataService,
   //  private hd: HeaderComponent
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

  allCatList() {
    this.catEnd = 2;
    this.isCollapse = false;
  }
  collapseCatList() {
    this.catEnd = 1;
    this.isCollapse = true;
  }

  addToCartOne(item: any) {
    console.log('item >>>>', item);
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart !== null) {
      if (this.cart.items.find(x => x.productId === item.id)) {
        const index = this.cart.items.findIndex((x: any) => x.productId === item.id);
        const newItem = {
          product: item,
          productId: item.id,
          quantity: this.cart.items[index].quantity + this.itemCount,
          status: 'Pending'
        };
        this.cart.items[index] = newItem;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      } else {
        const newItem = {
          product: item,
          productId: item.id,
          quantity: this.itemCount,
          status: 'Pending'
        };
        this.cart.items.push(newItem);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    } else {
      const items = [];
      const itemObj = {
        product: item,
        productId: item.id,
        quantity: this.itemCount,
        status: 'Pending'
      };
      items.push(itemObj);
      const payload = {
        items
      };
      localStorage.setItem('cart', JSON.stringify(payload));
    }
    this.dataService.presentToast('Added To cart' , 'success');
    this.hd.getCart();
  }
}
