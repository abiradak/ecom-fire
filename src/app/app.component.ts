import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Category',
      url: '/home',
      icon: 'heart'
    },
    {
      title: 'Profile',
      url: '/my-account',
      icon: 'mail'
    },
    {
      title: 'Order',
      url: '/view-cart',
      icon: 'paper-plane'
    },
    {
      title: 'About Us',
      url: '/about-us',
      icon: 'heart'
    },
  ];

  user: {};
  public labels = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataService,
    private router: Router
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
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.getUserDetails();
  }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userDetails'));
  }

  logout() {
    localStorage.removeItem('userDetails');
    this.data.presentToast('Logged Out successfully', 'success');
    this.getUserDetails();
  }

  login() {
    this.router.navigate(['login']);
  }
}
