import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  viewCat = false;

  public appPages = [];

  user: {};
  public labels = [];
  categories: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataService,
    private router: Router,
    private api: ApiService,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.menuController.enable(true);
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.getUserDetails();
    this.getCategories();
  }


  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }

  logout() {
    localStorage.removeItem('userDetails');
    this.data.presentToast('Logged Out successfully', 'success');
    this.getUserDetails();
    this.menuController.close();
  }

  login() {
    this.menuController.close();
    this.router.navigate(['login']);
  }

  getCatDropdown() {
    this.viewCat = true;
  }
  colapseDrop() {
    this.viewCat = false;
  }

  goToCart() {
    this.menuController.close();
    this.router.navigate(['view-cart']);
  }
  goToOrder() {
    this.menuController.close();
  }
  goToProfile() {
    this.menuController.close();
    this.router.navigate(['my-account']);
  }

  goToCatDe(item: any) {
    this.menuController.close();
    this.router.navigate(['item-category', 1]);
  }

  goToAboutUs() {
    this.menuController.close();
    this.router.navigate(['about-us']);
  }

  async getCategories(): Promise<void> {
    this.api.sendHttpCall('' , 'catagories' , 'get').pipe().subscribe( (res) => {
      this.categories = res.category;
      console.log('>>>>>>', this.categories);
    }, (err) => {
      console.log('>>>>>>>' , err);
    });
  }
}
