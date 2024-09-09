import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private darkModeSubject: BehaviorSubject<boolean>;
  public darkMode$: Observable<boolean>;

  private readonly DARK_MODE_KEY = 'darkMode';
  private isNavbarCloseSubject: BehaviorSubject<boolean>;
  public isNavbarClose$: Observable<boolean>;

  constructor() {
    const storedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);
    const initialState = storedDarkMode ? JSON.parse(storedDarkMode) : false;

    this.darkModeSubject = new BehaviorSubject<boolean>(initialState);
    this.darkMode$ = this.darkModeSubject.asObservable();

    this.isNavbarCloseSubject = new BehaviorSubject<boolean>(false);
    this.isNavbarClose$ = this.isNavbarCloseSubject.asObservable();
  }

  toggleDarkMode(): void {
    const currentValue = this.darkModeSubject.value;
    const newValue = !currentValue;

    localStorage.setItem(this.DARK_MODE_KEY, JSON.stringify(newValue));
    this.darkModeSubject.next(newValue);
  }

  togglenavbarWidth(close: boolean){
    this.isNavbarCloseSubject.next(close);
  }
}
