import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  showMainMenu = true;
  widgetlist = false;
  totalCourse = 0;
  totalSubscriber = 0;
  totalEnquiry = 0;
  colorMode = 'dark';

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private globalService: GlobalService,
  ) {
    this.globalService.getObservable().subscribe((data) => {
      // console.log('globalService Data received: ', data);
      if (data.showMainMenu === true || data.showMainMenu === false) {
        this.showMainMenu = data.showMainMenu;
        // console.log('this.showMainMenu: ', this.showMainMenu);
      }
    });
  }

  ngOnInit(): void {
    this.getCourseList();
  }

  menuClassDeatails(): string {
    if (this.showMainMenu === false) {
      return 'd-none2';
    } else {
      return '';
    }
  }

  colorDetails(): any {
    if (this.colorMode === 'dark') {
      return 'dark-theme';
    } else if (this.colorMode === 'light') {
      return 'light-theme';
    }
  }

  async getCourseList(): Promise<void> {
    const url = 'courses';
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('coming response blank >>>>>' , response);
      if (response.courses && response.courses.length > 0) {
        this.totalCourse = response.courses.length;
      } else {
        this.totalCourse = 0;
      }
      // console.log('this.courseList: ', this.courseList);
      this.getSubscriberList();
    }, (err) => {
      this.dataService.showError('Unable to count total course!');
      console.log('errors coming >>>>>>>' , err);
      this.getSubscriberList();
    });
  }

  async getSubscriberList(): Promise<void> {
    const url = 'subscribers';
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getSubscriberList response: ' , response);
      if (response.subscribers && response.subscribers.length > 0) {
        this.totalSubscriber = response.subscribers.length;
      } else {
        this.totalSubscriber = 0;
      }
      // console.log('this.subscriberList: ', this.subscriberList);
      this.getEnquiryList();
    }, (err) => {
      this.dataService.showError('Unable to count total subscriber!');
      console.log('errors coming >>>>>>>' , err);
      this.getEnquiryList();
    });
  }

  async getEnquiryList(): Promise<void> {
    const url = 'enquiries';
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getEnquiryList response: ' , response);
      if (response.enquiry && response.enquiry.length > 0) {
        this.totalEnquiry = response.enquiry.length;
      } else {
        this.totalEnquiry = 0;
      }
      // console.log('this.enquiryList: ', this.enquiryList);
    }, (err) => {
      this.dataService.showError('Unable to count total enquiry!');
      console.log('errors coming >>>>>>>' , err);
    });
  }
}
