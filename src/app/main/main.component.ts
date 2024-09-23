import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  currentDashboard!: string;
  dashboardTitle: string = "Dashboard";

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.mainService.currentDashboard$.subscribe(dashboard => {
      this.currentDashboard = dashboard;
      this.setDashboardTitle(dashboard);
    });
  }

  // Method to set title based on current dashboard
  setDashboardTitle(dashboard: string) {
    switch (dashboard) {
      case 'currency-exchanger':
        this.dashboardTitle = 'Currency Management';
        break;
      case 'general-ledger':
        this.dashboardTitle = 'General Ledger';
        break;
      default:
        this.dashboardTitle = 'Dashboard'; // Fallback title
        break;
    }
  }
}
