import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
})
export class TopNavbarComponent implements OnInit {
  @Input() dashboardTitle!: string;

  isDarkMode: boolean = false;
  isFullScreen: boolean = false;

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.mainService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });
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
}
