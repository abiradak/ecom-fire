import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  formated = new Date();

  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();



  loading: any;
  globaldata: any;
  isLoading: boolean;
  userinfo: any;

  emitChange(data: string) {
    this.emitChangeSource.next(data);
  }


  constructor(
    public loadingController: LoadingController,
    private alertCtrl: AlertController,
    private location: Location,
    public toastController: ToastController,
    // private storage: Storage,
  ) { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // setData(key: string , value: any) {
  //   this.storage.set(key, value);
  // }

  // getData(key: string) {
  //   return this.storage.get(key).then((value) => {
  //     return value;
  //   });
  // }


  // deleteData(key: string) {
  //   this.storage.remove(key);
  // }


  // New Method
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message,
      color,
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentLoading() {
    this.isLoading = true;
    this.loading = await this.loadingController.create({
     spinner: 'crescent',
     message: 'Please Wait!',
     translucent: true,
     cssClass: 'custom-class custom-loading'
    }).then( loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
 }

 async hideLoading(){
  this.isLoading = false;
  await this.loadingController.dismiss();
 }

 // New Method
 async presentAlert(message, header) {
  const alert = await this.alertCtrl.create({
    header,
    message,
    buttons: ['OK']
  });
  await alert.present();
}

isLogin() {
  this.userinfo = JSON.parse(localStorage.getItem('userDetails'));
  if ( this.userinfo !== null && this.userinfo !== '') {
    return true;
  } else {
    return false;
  }
}

  async presentAlertForEmpty() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'Please Enter All Details',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertForNoData() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'No Data Found',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertForImageUpFail2() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'Something Went Wrong!.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Back Button
  goBack(){
    this.location.back();
  }

  // Changing The Date Format For Html Into mm-dd-yy
  changeDateFormatForHtml(date) {
    const arr = date.split('/');
    return `${arr[0]}-${arr[1]}-${arr[2]}`;
  }
  //
  changeDateFormat(date){
    const arr = date.split('-');
    return `${arr[0]}/${arr[1]}/${arr[2]}`;
  }
  changeDateFormat2(date){
    const  formated = date.toString().substring(0, 10);
    const arr = formated.split('-');
    return `${arr[0]}/${arr[1]}/${arr[2]}`;
  }

  setvalue(data) {
    this.globaldata = data;
  }

  getvalue() {
    return new Promise((resolve, reject) => {
      if (this.globaldata) {
        resolve({ data: this.globaldata });
      } else {
        reject({ data: null });
      }
    });
  }
}
