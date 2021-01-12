import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { ItemcategoryComponent } from './itemcategory/itemcategory.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { ViewcartComponent } from './viewcart/viewcart.component';

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
    path: 'home',
    component: HomeComponent
  }
  ,
  {
    path: 'item-category',
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
