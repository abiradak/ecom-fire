import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public orderList: any = [];
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

    this.getOrderFromApi();
  }

  async getOrderFromApi(): Promise<void> {
    const url = 'pendingorders';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      console.log('getOrderFromApi response: ' , response);
      this.showloader = false;
      if (response.orders && response.orders.length > 0) {
        this.orderList = response.orders;
      } else {
        this.orderList = [];
        this.dataService.showError('No order found!');
      }
      // console.log('this.orderList: ', this.orderList);
    }, (error) => {
      console.log('getOrderFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load order list!');
    });
  }

  editOrder(orderDetails): void {
    this.router.navigate(['/order-edit/' + orderDetails.id]);
  }

  confirmDelete(orderId, index): void {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteOrder(orderId, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) { }
    });
  }

  async deleteOrder(orderId, index): Promise<void> {
    if (orderId !== null) {
      const url = 'order/delete/' + orderId;
      this.showloader = true;
      this.apiService.sendHttpCallWithToken('', url, 'delete').subscribe((response) => {
        // console.log('deleteOrder response: ' , response);
        this.showloader = false;
        if (response.status === 200) {
          this.orderList.splice(index, 1); // -- Remove the item from orderList array
          // this.dataService.showSuccess(response.message);
          Swal.fire(
            'Deleted!',
            'Order has been deleted',
            'success'
          );
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to delete order');
        }
      }, (error) => {
        this.showloader = false;
        console.log('deleteOrder error: ' , error);
        if (error.message) {
          this.dataService.showError(error.message);
        } else {
          this.dataService.showError('Unable to delete order');
        }
      });
    } else {
      this.dataService.showError('Details not found!');
    }
  }

}
