import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyManagementComponent } from './currency-management/currency-management.component';
import { MainComponent } from './main/main.component';
import { CurrencyExchangerComponent } from './currency-management/currency-exchanger/currency-exchanger.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyManagementComponent,
    MainComponent,
    CurrencyExchangerComponent,
    SideNavbarComponent,
    LoginSignupComponent,
    GeneralLedgerComponent,
    TopNavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
