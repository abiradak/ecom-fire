import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any;

  constructor(
    private api: ApiService
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
  }

  async getCategories(): Promise<void> {
    this.api.sendHttpCall('' , 'catagories' , 'get').pipe().subscribe( (res) => {
      this.categories = res.category;
    }, (err) => {
      console.log('>>>>>>>' , err);
    });
  }

}
