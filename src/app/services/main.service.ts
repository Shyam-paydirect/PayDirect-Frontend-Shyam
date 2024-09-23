import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private currentTheme = new BehaviorSubject<string>('light'); // Default theme
  theme$ = this.currentTheme.asObservable();

  private currentDashboard = new BehaviorSubject<string>(''); // Default dashboard
  currentDashboard$ = this.currentDashboard.asObservable();

  constructor() {
    this.loadDashboard(); // Load the dashboard from localStorage on service initialization
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
