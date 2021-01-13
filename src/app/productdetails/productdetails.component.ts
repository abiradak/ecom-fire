import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss'],
})
export class ProductdetailsComponent implements OnInit {
  details = {};

  itemCount = 1;
  productId: any;
  cart: any;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.getCategoryDetails();
  }

  async getCategoryDetails(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.sendHttpCall('' , `product/${id}` , 'get').pipe().subscribe( (res) => {
      console.log('id >>>>', res);
      this.details = res.product.data;
      this.productId = res.product.id;
      console.log('details', this.details);
    }, (err) => {
      console.log('>>>>>>>' , err);
    });
  }


  addToCart(): void {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart !== null) {
      if (this.cart.items.find(x => x.productId === this.productId)) {
        const index = this.cart.items.findIndex(x => x.productId === this.productId);
        const newItem = {
          product: this.details,
          productId: this.productId,
          quantity: this.cart.items[index].quantity + this.itemCount,
          status: 'Pending'
        };
        this.cart.items[index] = newItem;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      } else {
        const newItem = {
          product: this.details,
          productId: this.productId,
          quantity: this.itemCount,
          status: 'Pending'
        };
        this.cart.items.push(newItem);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    } else {
      const items = []
      const itemObj = {
        product: this.details,
        productId: this.productId,
        quantity: this.itemCount,
        status: 'Pending'
      }
      items.push(itemObj);
      const payload = {
        items: items
      }
      localStorage.setItem('cart', JSON.stringify(payload));
    }
    // this.itemCount = 1;
    this.dataService.presentToast('Added To cart' , 'success');
  }


  // addToCart(): void {
  //   const playLoad = {
  //     product: this.details,
  //     productId: this.productId,
  //     quantity: this.itemCount,
  //     status: 'Pending'
  //   }

  //   localStorage.setItem('cart', JSON.stringify(playLoad));
  //   this.dataService.presentToast('Added To cart' , 'success');
  // }

  increaseCounter() {
    this.itemCount = this.itemCount+1;
  }

  decreaseCounter() {
    this.itemCount = this.itemCount-1;
    if (this.itemCount === 1) {
      this.itemCount = 1;
    }
  }
}
