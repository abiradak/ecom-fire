import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { GlobalService } from '../services/global.service';
import { NgZone } from '@angular/core';
import { WindowRefService } from 'src/window-ref.service';

declare var RazorpayCheckout: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  currency;
  cartProducts = [];
  subTotal = 0;
  total = 0;
  constructor(
    private dataService: DataService,
    private globalService: GlobalService,
    private router: Router,
    private ngZone: NgZone,
    private winRef: WindowRefService
  ) {
    this.currency = this.dataService.currency;
  }

  ngOnInit(): void {
    this.cartProducts = this.dataService.getCartItem();
    this.calculatetotal();
  }

  calculatetotal(): void {
    this.subTotal = 0;
    this.cartProducts.forEach(element => {
      this.subTotal += +element.data.price * element.quantity;
    });
    this.total = this.subTotal + this.subTotal * 0.1; // 10% Tax
  }

  payWithRazor(amount) {
    // tslint:disable-next-line: variable-name
    let razor_key = null;
    switch (window.location.hostname) {
      case 'localhost':
        razor_key = 'rzp_live_lK742xvnlhxVfb'; // rzp_test_ZuG4AsF333ZWT4
        break;
      default:
        razor_key = 'rzp_live_lK742xvnlhxVfb'; // rzp_test_ZuG4AsF333ZWT4
        break;
    }

    const options: any = {
      key: razor_key,
      amount: amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Ecom', // company name or product name
      description: 'Ecom Fire', // product description
      image: `https://bookonline.tatamotors.com/cv/favicon.ico`, // company logo or product image
      modal: {
        escape: false,
      },
      notes: {},
      theme: {
        color: '#0c238a',
      },
    };
    options.handler = async (response: any, error: any) => {
      console.log("error", error);
    };
    options.modal.ondismiss = () => {
      // handle the case when user closes the form while transaction is in progress
      this.ngZone.run(() =>
        this.router.navigate(['/Profile'])
      );
      console.log('Transaction cancelled.');
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', (response: any) => {
      console.log('payment failed  >>>>>>>>>>>>>>  ', response);
    });
  }
}
