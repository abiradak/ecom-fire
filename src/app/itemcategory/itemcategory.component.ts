import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-itemcategory',
  templateUrl: './itemcategory.component.html',
  styleUrls: ['./itemcategory.component.scss'],
})
export class ItemcategoryComponent implements OnInit {

  details = {
    "id": "APwCOf1NKAb5GcIXTKtI",
    "data": {
        "isDeleted": 0,
        "isActive": 1,
        "name": "Category Two",
        "description": "Demo Description",
        "products": [
            "cHDBi4JEMOLzcwcz97VK",
            "YuCFtlGVYTRtiyMwdCfL",
            "kBRWUPj01UyltPL4bODY"
        ],
        "image": "hello.jpg"
    },
    "products": [
        {
            "inStock": 1,
            "image": "",
            "price": "560",
            "name": "Product One",
            "volume": "60",
            "isDeleted": 0,
            "description": "<p><span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</span></p>",
            "id": "YuCFtlGVYTRtiyMwdCfL"
        },
        {
            "description": "<p><span>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</span></p>",
            "volume": 200,
            "isDeleted": 0,
            "name": "Denim C Spray",
            "image": "",
            "price": "500",
            "inStock": 1,
            "id": "cHDBi4JEMOLzcwcz97VK"
        },
        {
            "name": "Denim B Spray",
            "image": "",
            "price": "300",
            "description": "<p><span>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</span></p>",
            "volume": 150,
            "isDeleted": 0,
            "inStock": 1,
            "id": "kBRWUPj01UyltPL4bODY"
        }
    ]
}

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // const data = this.route.snapshot.params;
    // console.log('data',  data);
  }

}
