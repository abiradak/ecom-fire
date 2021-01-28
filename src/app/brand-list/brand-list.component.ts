import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

  public brandList: any = [];
  dtOptions: DataTables.Settings = {};
  showloader = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.getBrandFromApi();
  }

  async getBrandFromApi(): Promise<void> {
    const url = 'brands';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getBrandFromApi response: ' , response);
      this.showloader = false;
      if (response.brand && response.brand.length > 0) {
        this.brandList = response.brand;
      } else {
        this.brandList = [];
        this.dataService.showError('No brand found!');
      }
      // console.log('this.brandList: ', this.brandList);
    }, (error) => {
      console.log('getBrandFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load brand list!');
    });
  }

  editBrand(brandDetails): void {
    this.router.navigate(['/brand-edit/' + brandDetails.id]);
  }

  confirmDelete(brandId, index): void {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteBrand(brandId, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) { }
    });
  }

  async deleteBrand(brandId, index): Promise<void> {
    if (brandId !== null) {
      const url = 'brand/delete/' + brandId;
      this.showloader = true;
      this.apiService.sendHttpCallWithToken('', url, 'delete').subscribe((response) => {
        // console.log('deleteBrand response: ' , response);
        this.showloader = false;
        if (response.status === 200) {
          this.brandList.splice(index, 1); // -- Remove the item from brandList array
          // this.dataService.showSuccess(response.message);
          Swal.fire(
            'Deleted!',
            'Brand has been deleted',
            'success'
          );
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to delete brand');
        }
      }, (error) => {
        this.showloader = false;
        console.log('deleteBrand error: ' , error);
        if (error.message) {
          this.dataService.showError(error.message);
        } else {
          this.dataService.showError('Unable to delete brand');
        }
      });
    } else {
      this.dataService.showError('Details not found!');
    }
  }

}
