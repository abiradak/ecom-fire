import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currency: string;
  public productList: any = [];
  dtOptions: DataTables.Settings = {};
  showloader = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private apiService: ApiService,
  ) {
    this.currency = this.dataService.currency;
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.getProductFromApi();
  }

  async getProductFromApi(): Promise<void> {
    const url = 'product';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getProductFromApi response: ' , response);
      this.showloader = false;
      if (response.product && response.product.length > 0) {
        this.productList = response.product;
      } else {
        this.productList = [];
        this.dataService.showError('No product found!');
      }
      // console.log('this.productList: ', this.productList);
    }, (error) => {
      console.log('getProductFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load product list!');
    });
  }

  editProduct(productDetails): void {
    this.router.navigate(['/product-edit/' + productDetails.id]);
  }

  // confirmDelete(courseId, index): void {
  //   Swal.fire({
  //     title: 'Are you sure want to remove?',
  //     text: 'You will not be able to recover this record!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.deleteCourse(courseId, index);
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // Swal.fire(
  //       //   'Cancelled',
  //       //   'Your imaginary file is safe :)',
  //       //   'error'
  //       // );
  //     }
  //   });
  // }

  // deleteCourse(courseId, index) {
  //   if (courseId !== null) {
  //     const url = 'course/delete/' + courseId;
  //     this.apiService.sendHttpCallWithToken('', url, 'delete').subscribe((response) => {
  //       // console.log('coming response blank >>>>>' , response);
  //       if (response.status === 200) {
  //         this.productList.splice(index, 1); // -- Remove the item from productList array
  //         // this.dataService.showSuccess(response.message);
  //         Swal.fire(
  //           'Deleted!',
  //           'Course has been deleted',
  //           'success'
  //         );
  //       } else if (response.status === 400) {
  //         this.dataService.showError(response.message);
  //       } else {
  //         this.dataService.showError('Unable to delete course');
  //       }
  //     }, (err) => {
  //       if (err.message) {
  //         this.dataService.showError(err.message);
  //       } else {
  //         this.dataService.showError('Unable to delete course');
  //       }
  //       console.log('errors coming >>>>>>>' , err);
  //     });
  //   } else {
  //     this.dataService.showError('Details not found!');
  //   }
  // }

}
