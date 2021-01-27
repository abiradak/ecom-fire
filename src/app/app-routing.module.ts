import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { BrandAddComponent } from './brand-add/brand-add.component';
import { BrandEditComponent } from './brand-edit/brand-edit.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'product-add',
        component: ProductAddComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'product-edit/:productId',
        component: ProductEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'category-add',
        component: CategoryAddComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'category-list',
        component: CategoryListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'category-edit/:categoryId',
        component: CategoryEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'brand-add',
        component: BrandAddComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'brand-list',
        component: BrandListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'brand-edit/:brandId',
        component: BrandEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'orders',
        component: OrderListComponent,
        canActivate: [AdminGuard],
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path:"**",
  //   component: NotFound404Component
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
