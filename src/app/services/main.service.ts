import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private currentTheme = new BehaviorSubject<string>('light');
  theme$ = this.currentTheme.asObservable();

  setTheme(theme: string) {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }
}
