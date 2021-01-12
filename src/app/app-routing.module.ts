import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
// import { LoginComponent } from './login/login.component';
// import { SubscriberListComponent } from './subscriber-list/subscriber-list.component';

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
      // {
      //   path: 'course-add',
      //   component: CourseAddComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'course-edit/:courseId',
      //   component: CourseEditComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'course-list',
      //   component: CourseListComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'subscriber-list',
      //   component: SubscriberListComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'enquiry-list',
      //   component: ContactListComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'content-edit/:contentId',
      //   component: ContentEditComponent,
      //   canActivate: [AdminGuard],
      // },
      // {
      //   path: 'content-list',
      //   component: ContentListComponent,
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
