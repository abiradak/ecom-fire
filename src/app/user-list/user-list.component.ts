import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList: any = [];
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

    this.getUserFromApi();
  }

  async getUserFromApi(): Promise<void> {
    const url = 'users';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getUserFromApi response: ' , response);
      this.showloader = false;
      if (response.users && response.users.length > 0) {
        this.userList = response.users;
      } else {
        this.userList = [];
        this.dataService.showError('No user found!');
      }
      // console.log('this.userList: ', this.userList);
    }, (error) => {
      console.log('getUserFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load user list!');
    });
  }

  editUser(userDetails): void {
    this.router.navigate(['/user-edit/' + userDetails.id]);
  }

  confirmDelete(userId, index): void {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteUser(userId, index);
      } else if (result.dismiss === Swal.DismissReason.cancel) { }
    });
  }

  async deleteUser(userId, index): Promise<void> {
    if (userId !== null) {
      const url = 'user/delete/' + userId;
      this.showloader = true;
      this.apiService.sendHttpCallWithToken('', url, 'delete').subscribe((response) => {
        // console.log('deleteuser response: ' , response);
        this.showloader = false;
        if (response.status === 200) {
          this.userList.splice(index, 1); // -- Remove the item from userList array
          // this.dataService.showSuccess(response.message);
          Swal.fire(
            'Deleted!',
            'User has been deleted',
            'success'
          );
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to delete user');
        }
      }, (error) => {
        this.showloader = false;
        console.log('deleteUser error: ' , error);
        if (error.message) {
          this.dataService.showError(error.message);
        } else {
          this.dataService.showError('Unable to delete user');
        }
      });
    } else {
      this.dataService.showError('Details not found!');
    }
  }

}
