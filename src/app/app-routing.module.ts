import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutHomeComponent } from './about-home/about-home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AdvantageComponent } from './advantage/advantage.component';
import { BannerComponent } from './banner/banner.component';
import { BrandsComponent } from './brands/brands.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FooterComponent } from './footer/footer.component';
import { HeadermainComponent } from './header/headermain/headermain.component';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { RegisterComponent } from './register/register.component';
import { ReviewComponent } from './review/review.component';
import { SendMailComponent } from './send-mail/send-mail.component';
import { SimilarProductComponent } from './similar-product/similar-product.component';
import { SingleCategoryComponent } from './single-category/single-category.component';
import { SliderComponent } from './slider/slider.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ViewCartComponent } from './view-cart/view-cart.component';

const routes: Routes = [
  {
    path: '',
    component: HeadermainComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'banner',
        component: BannerComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'single-category',
        component: SingleCategoryComponent
      },
      {
        path: 'product-details',
        component: ProductDetailsComponent
      },
      {
        path: 'view-cart',
        component: ViewCartComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'check-out',
        component: CheckoutComponent,
        canActivate: [LoginGuard],
      }
      ,
      {
        path: 'myAccount',
        component: MyAccountComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'about-us',
        component: AboutHomeComponent
      },
      {
        path: 'thankyou',
        component: ThankYouComponent
      }
    ]
  },
  {
    path: 'footer',
    component: FooterComponent
  },
  {
    path: 'slider',
    component: SliderComponent
  },
  {
    path: 'Product-category',
    component: ProductCategoryComponent
  },
  {
    path: 'advantage',
    component: AdvantageComponent
  },
  {
    path: 'about-home',
    component: AboutHomeComponent
  }
  ,
  {
    path: 'product-slider',
    component: ProductSliderComponent
  },
  {
    path: 'send-mail',
    component: SendMailComponent
  }
  ,
  {
    path: 'review',
    component: ReviewComponent
  },
  {
    path: 'brands',
    component: BrandsComponent
  },
  {
    path: 'main-menu',
    component: MainMenuComponent
  }
  ,
  {
    path: 'similar-product',
    component: SimilarProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
