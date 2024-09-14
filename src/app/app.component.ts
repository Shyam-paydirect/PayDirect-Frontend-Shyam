import { Component, Renderer2 } from '@angular/core';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PayDirectFrontend';
  constructor(private mainService: MainService, private renderer: Renderer2) {}

  ngOnInit() {
    this.mainService.theme$.subscribe((theme) => {
      if (theme === 'dark') {
        this.renderer.addClass(document.documentElement, 'dark');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark');
      }
    });
    this.mainService.loadTheme();
  }
}
