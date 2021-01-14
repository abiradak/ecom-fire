import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currency = 'RUB';
  toastConfig: object = {
    timeOut: 3000,
    progressBar: true,
  };

  constructor(
    private toastr: ToastrService,
  ) { }

  // --- For showing the success toast
  showSuccess(message, title: any = null): void {
    this.toastr.success(message, 'Success!', this.toastConfig);
  }

  // --- For showing the error toast
  showError(message, title: any = null): void {
    this.toastr.error(message, 'Error!', this.toastConfig);
  }

  // --- For showing the info toast
  showInfo(message, title: any = null): void {
    this.toastr.info(message, 'Info!', this.toastConfig);
  }

  setCartItem(cartProducts): void {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  }

  getCartItem(): any {
    let cartProducts = [];
    if (localStorage.getItem('cartProducts')) {
      cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    }
    return cartProducts;
  }
}
