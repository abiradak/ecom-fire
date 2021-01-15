import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent implements OnInit {

  constructor(
    private data: DataService
  ) { }

  ngOnInit() {}

  back() {
    this.data.goBack();
  }

}
