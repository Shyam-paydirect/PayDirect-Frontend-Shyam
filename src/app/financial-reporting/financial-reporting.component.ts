import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-financial-reporting',
  templateUrl: './financial-reporting.component.html',
  styleUrls: ['./financial-reporting.component.css'],
})
export class FinancialReportingComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Financial Reporting');
  }
}
