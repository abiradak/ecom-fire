import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss'],
})
export class ProductdetailsComponent implements OnInit {

  details = {
    name: 'Denim Axe 2',
    description: 'This is the dummy data',
    image: 'bse.jpg',
    price: 500,
    volume: 150,
    inStock: 1,
    isDeleted: 0,
  }

  constructor() { }

  ngOnInit() {}

}
