import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    margin: 25,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    nav: true,
    navSpeed: 400,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      600: {
        items: 4
      },
      1023: {
        items: 6
      }
    },

  };

  constructor() { }

  ngOnInit(): void {
  }

}
