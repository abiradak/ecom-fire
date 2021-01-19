import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { ItemcategoryComponent } from './itemcategory/itemcategory.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { ViewcartComponent } from './viewcart/viewcart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }
  ,
  {
    path: 'item-category/:id',
    component: ItemcategoryComponent
  },
  {
    path: 'product-details/:id',
    component: ProductdetailsComponent
  }
  ,
  {
    path: 'view-cart',
    component: ViewcartComponent
  }
  ,
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'address',
    component: AddressComponent
  },
  {
    path: 'my-account',
    component: MyaccountComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  },
  {
    path: 'about-us',
    component: AboutusComponent
  }
];
// const routes: Routes = [
//   {
//   path: '',
//   component: HeaderComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: '/home',
//         pathMatch: 'full'
//       },
//       {
//         path: 'login',
//         component: LoginComponent
//       },
//       {
//         path: 'home',
//         component: HomeComponent
//       }
//       ,
//       {
//         path: 'item-category/:id',
//         component: ItemcategoryComponent
//       },
//       {
//         path: 'product-details/:id',
//         component: ProductdetailsComponent
//       }
//       ,
//       {
//         path: 'view-cart',
//         component: ViewcartComponent
//       }
//       ,
//       {
//         path: 'checkout',
//         component: CheckoutComponent
//       },
//       {
//         path: 'address',
//         component: AddressComponent
//       },
//       {
//         path: 'my-account',
//         component: MyaccountComponent
//       },
//       {
//         path: 'register',
//         component: RegisterComponent
//       },
//       {
//         path: 'thankyou',
//         component: ThankyouComponent
//       },
//       {
//         path: 'about-us',
//         component: AboutusComponent
//       }
//     ]
//   }
// ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
