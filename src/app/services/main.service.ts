import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private sidenavStateSubject = new BehaviorSubject<boolean>(false); // Default closed on smaller screens
  sidenavState$ = this.sidenavStateSubject.asObservable();

  private currentTheme = new BehaviorSubject<string>('light'); // Default theme
  theme$ = this.currentTheme.asObservable();

  private currentDashboard = new BehaviorSubject<string>(''); // Default dashboard
  currentDashboard$ = this.currentDashboard.asObservable();

  constructor() {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth.bind(this)); // Call checkScreenWidth on resize

    this.loadDashboard(); // Load the dashboard from localStorage on service initialization
  }

  toggleSidenav() {
    this.sidenavStateSubject.next(!this.sidenavStateSubject.value);
  }

  closeSidenav() {
    this.sidenavStateSubject.next(true);
  }

  openSidenav() {
    this.sidenavStateSubject.next(false);
  }

  private checkScreenWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 992) {
      this.sidenavStateSubject.next(true); // Closed on smaller screens
    } else {
      this.sidenavStateSubject.next(false); // Open on larger screens
    }
  }

  setTheme(theme: string) {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  changeDashboard(dashboard: string) {
    this.currentDashboard.next(dashboard);
    localStorage.setItem('dashboard', dashboard); // Store the selected dashboard
  }

  loadDashboard() {
    const savedDashboard =
      localStorage.getItem('dashboard') || 'general-ledger'; // Fallback to default
    this.currentDashboard.next(savedDashboard);
  }
}
