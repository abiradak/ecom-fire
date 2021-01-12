import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
export const apiUrl = 'https://ecom-14f13.web.app/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  alert: any;
  globaldata: any;
  settedValue: any;
  token: any;

  constructor(
    public http: HttpClient,
    private dataservice: DataService
  ) { }

  // getToken() {
  //   this.token = JSON.parse(localStorage.getItem('token'));
  //   return this.token;
  // }

  // sendHttpCallForImageUpload(data: any = '', url: any, method: any) {
  //   if (navigator.onLine === false) {
  //     this.dataservice.presentToast('Opps unable to connect internet' , 'danger');
  //   } else {
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         accept: 'aplication/json',
  //         'Content-Type': 'multipart/form-data'
  //       })
  //     };
  //     return this.http.post<any>(apiUrl + url, (data), httpOptions );
  //   }
  // }


  sendHttpCallWithToken(data: any = '', url: any, method: any): Observable<any> {
    if (navigator.onLine === false) {
     this.dataservice.showError('No Connection!' , 'Warning');
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json',
         //  Authorization: 'Bearer ' + this.getToken()
        })
      };

      switch (method) {
        case 'post':
          return this.http.post<any>(apiUrl + url, (data), httpOptions );

        case 'get':
          return this.http.get<any>(apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(apiUrl + url, (data), httpOptions);

        case 'delete':
          return this.http.delete<any>(apiUrl + url, httpOptions);

        default:
          console.log('Add method');
      }
    }
  }
}
