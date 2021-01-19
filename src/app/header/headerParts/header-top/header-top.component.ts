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

  constructor(
    private dataService: DataService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.globalService.getObservable().subscribe((data) => {
      // console.log('globalService Data received: ', data);
      if (data.isLoggedin === true) {
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    if (this.dataService.checkLogin()) {
      this.isLoggedIn = true;
    }
  }

  logOut(): void {
    if (localStorage.getItem('loginData')) {
      localStorage.removeItem('loginData');
      this.isLoggedIn = false;

      const currentPage = this.dataService.checkCurrentPage();
      console.log('currentPage: ', currentPage);
      if (currentPage === '/check-out' || currentPage === '/myAccount') {
        this.router.navigate(['home']);
      }
    }
  }

}
