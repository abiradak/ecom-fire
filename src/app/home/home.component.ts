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

  newItemsArray = [
            {
              'inStock': 1,
              'price': '560',
              'description': '<p><span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.</span></p>',
              'image': '',
              'isDeleted': 0,
              'volume': '60',
              'name': 'Product One',
              'id': 'YuCFtlGVYTRtiyMwdCfL'
            },
            {
              'isDeleted': 0,
              'name': 'Denim C Spray',
              'volume': 200,
              'image': '',
              'description': '<p><span>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.</span></p>',
              'price': '500',
              'inStock': 1,
              'id': 'cHDBi4JEMOLzcwcz97VK'
            },
            {
              'price': '300',
              'name': 'Denim B Spray',
              'image': '',
              'volume': 150,
              'isDeleted': 0,
              'description': '<p><span>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</span></p>',
              'inStock': 1,
              'id': 'kBRWUPj01UyltPL4bODY'
            }
    ];
  bestSeller = [
    {
              'inStock': 1,
              'price': '560',
              'description': '<p><span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.</span></p>',
              'image': '',
              'isDeleted': 0,
              'volume': '60',
              'name': 'Product One',
              'id': 'YuCFtlGVYTRtiyMwdCfL'
            },
            {
              'isDeleted': 0,
              'name': 'Denim C Spray',
              'volume': 200,
              'image': '',
              'description': '<p><span>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.</span></p>',
              'price': '500',
              'inStock': 1,
              'id': 'cHDBi4JEMOLzcwcz97VK'
            },
            {
              'price': '300',
              'name': 'Denim B Spray',
              'image': '',
              'volume': 150,
              'isDeleted': 0,
              'description': '<p><span>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</span></p>',
              'inStock': 1,
              'id': 'kBRWUPj01UyltPL4bODY'
            }
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private dataService: DataService,
    // private hd: HeaderComponent
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
  }
}
