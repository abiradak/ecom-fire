import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  newItemsArray = [];
  bestSeller = [];
  isLoading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private dataService: DataService,
    private menuController: MenuController
  ) { }

  slideOpts1 = {
    loop: true,
    autoplay: true,
    slidesPerView: 1,
    initialSlide: 1,
    speed: 400
  };

  ngOnInit() {
    this.menuController.enable(true);
    this.getProducts();
    this.getCart();
  }

  async getCategories(): Promise<void> {
    this.api.sendHttpCall('' , 'catagories' , 'get').pipe().subscribe( (res) => {
      this.categories = res.category;
      this.categories.forEach((element: any) => {
        if (element.data.name === 'Best Seller') {
          this.bestSeller = element.products;
        }
      });
      this.isLoading = false;
      console.log('best seller', this.bestSeller);
    }, (err) => {
      this.isLoading = false;
      console.log('category data >>>>>>>' , err);
    });
  }

  async getProducts(): Promise<void> {
    this.isLoading = true;
    this.api.sendHttpCall('' , 'product' , 'get').pipe().subscribe( (res) => {
      this.newItemsArray = res.products;
      this.getCategories();
      console.log('pro data >>>>>>', this.newItemsArray);
    }, (err) => {
      this.isLoading = false;
      console.log('category data >>>>>>>' , err);
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

  goToCate(id: any) {
    this.router.navigate(['item-category', id]);
  }

  allCatList() {
    this.catEnd = this.categories.length;
    this.isCollapse = false;
  }
  collapseCatList() {
    this.catEnd = 1;
    this.isCollapse = true;
  }

  addToCartOne(item: any) {
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
  }
}
