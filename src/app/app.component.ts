import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MaterialModule } from './shared/modules/material/material.module';
import { ThemeService } from './services/theme.service';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('darkModeSwitch', { read: ElementRef }) element:
    | ElementRef
    | undefined;

  title: string = 'final-project';
  logoUrl = '';
  checked = false;
  provider: any;
  user:any;

  sun =
    'M12 15.5q1.45 0 2.475-1.025Q15.5 13.45 15.5 12q0-1.45-1.025-2.475Q13.45 8.5 12 8.5q-1.45 0-2.475 1.025Q8.5 10.55 8.5 12q0 1.45 1.025 2.475Q10.55 15.5 12 15.5Zm0 1.5q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.537 1.463T17 12q0 2.075-1.463 3.537T12 17ZM1.75 12.75q-.325 0-.538-.213Q1 12.325 1 12q0-.325.212-.537Q1.425 11.25 1.75 11.25h2.5q.325 0 .537.213Q5 11.675 5 12q0 .325-.213.537-.213.213-.537.213Zm18 0q-.325 0-.538-.213Q19 12.325 19 12q0-.325.212-.537.212-.213.538-.213h2.5q.325 0 .538.213Q23 11.675 23 12q0 .325-.212.537-.212.213-.538.213ZM12 5q-.325 0-.537-.213Q11.25 4.575 11.25 4.25v-2.5q0-.325.213-.538Q11.675 1 12 1q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.537Q12.325 5 12 5Zm0 18q-.325 0-.537-.212-.213-.212-.213-.538v-2.5q0-.325.213-.538Q11.675 19 12 19q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.538Q12.325 23 12 23ZM6 7.05l-1.425-1.4q-.225-.225-.213-.537.013-.312.213-.537.225-.225.537-.225t.537.225L7.05 6q.2.225 .2.525 0 .3-.2.5-.2.225-.513.225-.312 0-.537-.2Zm12.35 12.375L16.95 18q-.2-.225-.2-.538t.225-.512q.2-.225.5-.225t.525.225l1.425 1.4q.225.225 .212.538-.012.313-.212.538-.225.225-.538.225t-.538-.225ZM16.95 7.05q-.225-.225-.225-.525 0-.3.225-.525l1.4-1.425q.225-.225.538-.213.313 .013.538 .213.225 .225.225 .537t-.225.537L18 7.05q-.2.2-.512.2-.312 0-.538-.2ZM4.575 19.425q-.225-.225-.225-.538t.225-.538L6 16.95q.225-.225.525-.225.3 0 .525.225 .225.225 .225.525 0 .3-.225.525l-1.4 1.425q-.225.225-.537.212-.312-.012-.537-.212ZM12 12Z';
  moon =
    'M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.2 0 .425.013 .225.013 .575.038-.9.8-1.4 1.975-.5 1.175-.5 2.475 0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.3 0 2.475-.463T20.95 11.15q.025.3 .038.488Q21 11.825 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687t2.525-3.963q-.625.275-1.337.412Q17.225 14.4 16.5 14.4q-2.875 0-4.887-2.013T9.6 7.5q0-.6.125-1.287.125-.687.45-1.562-2.45.675-4.062 2.738Q4.5 9.45 4.5 12q0 3.125 2.188 5.313T12 19.5Zm-.1-7.425Z';

  constructor(public themeService: ThemeService, private router: Router) {}

  app = initializeApp(firebaseConfig);
  auth = getAuth(this.app);

  ngOnInit(): void {
    var provider = new GoogleAuthProvider();
    this.provider = provider;
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    if (this.element) {
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--on')
        .firstChild.setAttribute('d', this.moon);
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--off')
        .firstChild.setAttribute('d', this.sun);
    }
  }

  updateLogo() {
    this.logoUrl = this.themeService.darkModeEnabled
      ? '../public/assets/images/mikademy_neg_bg.png'
      : '../public/assets/images/mikademy_bg.png';
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
    this.updateLogo();
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  }

  logout(){
    signOut(this.auth).then(function() {
     console.log("sign out");
     
    }).catch(function(error) {
      // An error happened.
    });
  }
}
