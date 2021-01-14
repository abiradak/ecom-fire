import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.checkLogin()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  checkLogin(): boolean {
    let isLogin = false;

    if (localStorage.getItem('loginData')) {
      const loginData = JSON.parse(localStorage.getItem('loginData'));
      isLogin = loginData.isLogin;
    }
    // console.log('checkLogin isLogin: ', isLogin);

    return isLogin;
  }

}
