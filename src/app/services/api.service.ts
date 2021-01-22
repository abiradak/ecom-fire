import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient,
    private dataService: DataService,
  ) { }

  sendHttpCallWithToken(data: any = '', url: any, method: any): Observable<any> {
    if (navigator.onLine === false) {
      this.dataService.showError('No Internet Connection'); // --- Display error message
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json',
          // Authorization: token
        })
      };

      switch (method) {
        case 'post':
          return this.http.post<any>(environment.apiUrl + url, (data), httpOptions );

        case 'get':
          return this.http.get<any>(environment.apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(environment.apiUrl + url, (data), httpOptions);

        case 'patch':
          return this.http.patch<any>(environment.apiUrl + url, (data), httpOptions);

        case 'delete':
          return this.http.delete<any>(environment.apiUrl + url, httpOptions);

        default:
          console.log('Add method');
      }
    }
  }

}
