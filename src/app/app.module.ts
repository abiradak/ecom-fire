import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ItemcategoryComponent } from './itemcategory/itemcategory.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { ViewcartComponent } from './viewcart/viewcart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddressComponent } from './address/address.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './services/loading';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { Globals } from './services/global';
import { EventEmitterService } from './services/event-emitter.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemcategoryComponent,
    ProductdetailsComponent,
    ViewcartComponent,
    CheckoutComponent,
    AddressComponent,
    MyaccountComponent,
    LoginComponent,
    RegisterComponent,
    ThankyouComponent,
    AboutusComponent,
    HeaderComponent,
    LoadingComponent,
    ForgetpasswordComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataService,
    EventEmitterService,
    Globals,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
