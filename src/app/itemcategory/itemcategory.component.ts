import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { EventEmitterService } from '../services/event-emitter.service';


@Component({
  selector: 'app-itemcategory',
  templateUrl: './itemcategory.component.html',
  styleUrls: ['./itemcategory.component.scss'],
})
export class ItemcategoryComponent implements OnInit {

  details = {};
  isLoading = false;
  products = [];
  cart: any;
  itemCount = 1;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private data: DataService,
    private event: EventEmitterService
  ) { }

  ngOnInit() {
    // const data = this.route.snapshot.params;
    // console.log('data',  data);
    this.getCategoryData();
  }

  getCategoryData() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.api.sendHttpCall('' , `category/${id}` , 'get').pipe().subscribe( (res) => {
      console.log('res', res);
      this.details = res.category.data;
      this.products = res.category.products;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log('category data >>>>>>>' , err);
    });
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
    this.ngOnInit();
    this.event.onCartAdd();
    this.data.presentToast('Added To cart' , 'success');
  }

}
