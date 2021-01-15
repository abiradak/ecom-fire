import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent implements OnInit {

  constructor(
    private dataSer: DataService
  ) { }

  ngOnInit() {}

  back() {
    this.dataSer.goBack();
  }

}
