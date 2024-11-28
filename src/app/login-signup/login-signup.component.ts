import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent implements AfterViewInit {
  isDarkMode: boolean = false;
  email: string = '';
  usernameSignup: string = '';
  passwordSignup: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
    private mainService: MainService
  ) {}

  ngOnInit(): void {
    this.mainService.theme$.subscribe((theme) => {
      this.isDarkMode = (theme == 'dark');
    });
  }

  ngAfterViewInit(): void {
    const inputs = this.el.nativeElement.querySelectorAll('.input-field');
    const toggleBtns = this.el.nativeElement.querySelectorAll('.toggle');
    const main = this.el.nativeElement.querySelector('main');
    const bullets = this.el.nativeElement.querySelectorAll('.bullets span');
    const images = this.el.nativeElement.querySelectorAll('.image');

    inputs.forEach((inp: Element) => {
      const inputElement = inp as HTMLElement;
      this.renderer.listen(inputElement, 'focus', () => {
        this.renderer.addClass(inputElement, 'active');
      });
      this.renderer.listen(inputElement, 'blur', () => {
        if ((<HTMLInputElement>inputElement).value !== '') return;
        this.renderer.removeClass(inputElement, 'active');
      });
    });

    toggleBtns.forEach((btn: Element) => {
      const btnElement = btn as HTMLElement;
      this.renderer.listen(btnElement, 'click', () => {
        if (main.classList.contains('sign-up-mode')) {
          this.renderer.removeClass(main, 'sign-up-mode');
        } else {
          this.renderer.addClass(main, 'sign-up-mode');
        }
      });
    });

    bullets.forEach((bullet: Element) => {
      const bulletElement = bullet as HTMLElement;
      this.renderer.listen(bulletElement, 'click', () =>
        this.moveSlider(bulletElement, images, bullets)
      );
    });
  }

  private moveSlider(
    bullet: HTMLElement,
    images: NodeListOf<Element>,
    bullets: NodeListOf<Element>
  ) {
    const index = bullet.getAttribute('data-value');
    const currentImage = this.el.nativeElement.querySelector(`.img-${index}`);

    images.forEach((img: Element) => {
      const imgElement = img as HTMLElement;
      this.renderer.removeClass(imgElement, 'show');
    });
    if (currentImage) {
      this.renderer.addClass(currentImage as HTMLElement, 'show');
    }

    const textSlider = this.el.nativeElement.querySelector(
      '.text-group'
    ) as HTMLElement;
    if (textSlider) {
      this.renderer.setStyle(
        textSlider,
        'transform',
        `translateY(${-(Number(index) - 1) * 2.2}rem)`
      );
    }

    bullets.forEach((bull: Element) => {
      const bullElement = bull as HTMLElement;
      this.renderer.removeClass(bullElement, 'active');
    });
    this.renderer.addClass(bullet, 'active');
  }

  onLogin() {
    this.authService.login(this.username, this.password);
  }

  onSignup() {
    this.authService.signup(this.email, this.usernameSignup, this.passwordSignup).subscribe(
      (success) => {
        if (success) {
          const main = this.el.nativeElement.querySelector('main');
          this.renderer.removeClass(main, 'sign-up-mode');
          this.renderer.addClass(main, 'sign-up-mode');
        }
      }
    );
  }

  sendOTP() {}
}
