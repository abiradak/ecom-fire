import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currency = '$';
  nameValidationRegex = /^[a-zA-Z\s-,.\']+$/;
  emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  phoneValidationRegex = /^[\d+]+$/;
  passwordValidationRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // -- Minimum eight characters, at least one letter and one number
  toastConfig: object = {
    timeOut: 3000,
    progressBar: true,
  };

  constructor(
    private toastr: ToastrService,
    private router: Router,
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

  checkLogin(): boolean {
    if (localStorage.getItem('loginData')) {
      return true;
    } else {
      return false;
    }
  }

  checkCurrentPage(): any {
    const currentPage = this.router.url;
    // console.log('>>>>>>>>', currentPage);
    return currentPage;
  }
}
