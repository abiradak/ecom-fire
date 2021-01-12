import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ProductAddComponent } from './product-add/product-add.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'product-add',
        component: ProductAddComponent,
        // canActivate: [AdminGuard],
      },
      // {
      //   path: 'course-edit/:courseId',
      //   component: CourseEditComponent,
      //   canActivate: [AdminGuard],
      // },
    ]
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
