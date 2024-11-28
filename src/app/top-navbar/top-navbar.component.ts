import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
})
export class TopNavbarComponent implements OnInit {
  @Input() dashboardTitle!: string;

  close: boolean = false;
  isDarkMode: boolean = false;
  isFullScreen: boolean = false;
  merchantDetails: any;
  defaultImageUrl = 'assets/img/defaultDP.jpeg';

  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mainService.sidenavState$.subscribe((state) => {
      this.close = state;
    });

    this.mainService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });

    // Subscribe to the merchantDetails$ BehaviorSubject to get merchant data
    this.authService.merchantDetails$.subscribe((details) => {
      this.merchantDetails = details;
      this.cdr.detectChanges();
    });
  }

  toggleSidenav() {
    this.mainService.toggleSidenav();
  }

  openSidenav() {
    this.mainService.openSidenav();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const selectedTheme = this.isDarkMode ? 'dark' : 'light';
    this.mainService.setTheme(selectedTheme);
  }

  toggleFullscreen() {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      const requestFullscreen =
        elem.requestFullscreen ||
        (elem as any).webkitRequestFullscreen ||
        (elem as any).msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(elem);
        this.isFullScreen = true;
      }
    } else {
      const exitFullscreen =
        document.exitFullscreen ||
        (document as any).webkitExitFullscreen ||
        (document as any).msExitFullscreen;

      if (exitFullscreen) {
        exitFullscreen.call(document);
        this.isFullScreen = false;
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImageUrl; // Fallback to default image
  }

  toggleProfileMenu() {
    let profileMenuParent = document.getElementById("profileMenuParent");
    profileMenuParent?.classList.toggle("open-menu");
  }
}
