import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {

  isLoggedIn = false;
  name = 'Cabinet';
  cartProducts = [];

  constructor(
    private dataService: DataService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.globalService.getObservable().subscribe((data) => {
      // console.log('globalService Data received: ', data);
      if (data.isLoggedin === true) {
        this.isLoggedIn = true;
        this.ngOnInit();
      } else if (data.changename) {
        this.name = data.changename;
      } else if (data.updateCart === true) {
        this.cartProducts = this.dataService.getCartItem();
      }
    });
  }

  ngOnInit(): void {
    if (this.dataService.checkLogin()) {
      this.isLoggedIn = true;
      if (localStorage.getItem('loginData')) {
        const profileData = JSON.parse(localStorage.getItem('loginData'));
        this.name = profileData.name;
      }
    }

    this.cartProducts = this.dataService.getCartItem();
    console.log('this.cartProducts>>>>>>: ', this.cartProducts);
  }

  logOut(): void {
    if (localStorage.getItem('loginData')) {
      localStorage.removeItem('loginData');
      this.isLoggedIn = false;
      this.name = 'Cabinet';

      const currentPage = this.dataService.checkCurrentPage();
      console.log('currentPage: ', currentPage);
      if (currentPage === '/check-out' || currentPage === '/myAccount') {
        this.router.navigate(['home']);
      }
    }
  }

}
