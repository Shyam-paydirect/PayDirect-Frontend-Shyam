import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  isDarkMode: boolean = true;
  openSublists: { [key: string]: boolean } = {};
  close: boolean = false;

  constructor(private mainService: MainService) {
  }

  ngOnInit(): void {
    // Subscribe to sidenav state
    this.mainService.sidenavState$.subscribe((state) => {
      this.close = state;
    });

    // Subscribe to theme changes
    this.mainService.theme$.subscribe((theme) => {
      this.isDarkMode = (theme == 'dark');
    });
  }

  toggleSublist(sublist: string): void {
    this.openSublists[sublist] = !this.openSublists[sublist];
  }

  isSublistOpen(sublist: string): boolean {
    return this.openSublists[sublist];
  }

  toggleSidenav() {
    this.mainService.toggleSidenav();
  }

  closeSidenav() {
    this.mainService.closeSidenav();
  }

  selectDashboard(dashboard: string) {
    this.mainService.changeDashboard(dashboard);
    if (window.innerWidth <= 768) {
      this.toggleSidenav();
    }
  }
}
