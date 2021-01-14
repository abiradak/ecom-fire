import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    margin: 25,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    nav: true,
    navSpeed: 300,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
     1023: {
        items: 3
      }
      ,
     1200: {
        items: 4
      }
    },

  };
  currency;
  showloader = false;
  categories = [];
  newProducts = [];

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) {
    this.currency = this.dataService.currency;
  }

  ngOnInit(): void {
    this.getCategoriesFromApi();
  }

  async getCategoriesFromApi(): Promise<void> {
    const url = `/catagories`;
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url , 'get').subscribe((response) => {
      // console.log('getCategoriesFromApi response: ' , response);
      this.showloader = false;
      if (response.category && response.category.length > 0) {
        this.categories = response.category;
      }
      this.getProductsFromApi();
    }, (error: any) => {
      console.log('getCategoriesFromApi errors: ' , error);
      this.showloader = false;
      this.getProductsFromApi();
    });
  }

  async getProductsFromApi(): Promise<void> {
    const url = `/product`;
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url , 'get').subscribe((response) => {
      // console.log('getProductsFromApi response: ' , response);
      this.showloader = false;
      if (response.product && response.product.length > 0) {
        this.newProducts = response.product;
      }
    }, (error: any) => {
      console.log('getProductsFromApi errors: ' , error);
      this.showloader = false;
    });
  }

  addToCart(product): void {
    console.log('addToCart product: ', product);
    const cartProduct = {
      id: product.id,
      data: product.data,
      quantity: 1
    };
    this.dataService.setCartItem(cartProduct);
  }

}
