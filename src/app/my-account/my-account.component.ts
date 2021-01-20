import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  currentTab = 1;
  profileData = null;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('loginData')) {
      this.profileData = JSON.parse(localStorage.getItem('loginData'));
      console.log('this.profileData: ', this.profileData);
    }
  }

  changeTab(currentTab): void {
    this.currentTab = currentTab;
  }

}
