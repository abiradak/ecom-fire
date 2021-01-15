import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { HeadermainComponent } from './header/headermain/headermain.component';
import { HeaderTopComponent } from './header/headerParts/header-top/header-top.component';
import { HeaderBottomComponent } from './header/headerParts/header-bottom/header-bottom.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { SliderComponent } from './slider/slider.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { AdvantageComponent } from './advantage/advantage.component';
import { AboutHomeComponent } from './about-home/about-home.component';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { SendMailComponent } from './send-mail/send-mail.component';
import { ReviewComponent } from './review/review.component';
import { BrandsComponent } from './brands/brands.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SingleCategoryComponent } from './single-category/single-category.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SimilarProductComponent } from './similar-product/similar-product.component';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './loading/loading.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AboutComponent } from './about/about.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    HeadermainComponent,
    HeaderTopComponent,
    HeaderBottomComponent,
    BannerComponent,
    FooterComponent,
    SliderComponent,
    AboutUsComponent,
    HomeComponent,
    ProductCategoryComponent,
    AdvantageComponent,
    AboutHomeComponent,
    ProductSliderComponent,
    SendMailComponent,
    ReviewComponent,
    BrandsComponent,
    MainMenuComponent,
    SingleCategoryComponent,
    ProductDetailsComponent,
    SimilarProductComponent,
    ViewCartComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    MyAccountComponent,
    AboutComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule,
    OverlayModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
