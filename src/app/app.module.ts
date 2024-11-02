import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyManagementComponent } from './currency-management/currency-management.component';
import { MainComponent } from './main/main.component';
import { CurrencyExchangerComponent } from './currency-management/currency-exchanger/currency-exchanger.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { CurrencyTransactionsComponent } from './currency-management/currency-transactions/currency-transactions.component';
import { AccountDetailsComponent } from './currency-management/account-details/account-details.component';
import { RecentPaymentsComponent } from './currency-management/recent-payments/recent-payments.component';
import { FinancialReportingComponent } from './financial-reporting/financial-reporting.component';
import { FinancialAnalyticsComponent } from './financial-reporting/financial-analytics/financial-analytics.component';
import { FinancialOverviewComponent } from './financial-reporting/financial-overview/financial-overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyManagementComponent,
    MainComponent,
    CurrencyExchangerComponent,
    SideNavbarComponent,
    LoginSignupComponent,
    GeneralLedgerComponent,
    TopNavbarComponent,
    AdminPortalComponent,
    CurrencyTransactionsComponent,
    AccountDetailsComponent,
    RecentPaymentsComponent,
    FinancialReportingComponent,
    FinancialAnalyticsComponent,
    FinancialOverviewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true, 
      closeButton: true, 
      progressBar: true, 
      progressAnimation: 'increasing'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
