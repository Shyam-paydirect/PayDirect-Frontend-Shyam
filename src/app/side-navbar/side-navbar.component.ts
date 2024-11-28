import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent implements OnInit {
  isDarkMode: boolean = true;
  openSublists: { [key: string]: boolean } = {};
  close: boolean = false;
  merchantDetails: any;

  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to sidenav state
    this.mainService.sidenavState$.subscribe((state) => {
      this.close = state;
    });

    // Subscribe to theme changes
    this.mainService.theme$.subscribe((theme) => {
      this.isDarkMode = theme == 'dark';
    });

    this.authService.merchantDetails$.subscribe((details) => {
      this.merchantDetails = details;
      this.cdr.detectChanges();
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
