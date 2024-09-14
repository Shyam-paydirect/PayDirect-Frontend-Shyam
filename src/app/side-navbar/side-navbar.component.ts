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

  toggleClose(){
    this.close = !this.close;
  }
}
