import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {AuthenticationStateService} from "../../auth/authentication-state.service";

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
})
export class TopMenuComponent {
  isAuthenticated$: Observable<boolean>;
  userData$: Observable<{ userName: string | null }>;

  constructor(private authStateService: AuthenticationStateService) {
    this.isAuthenticated$ = this.authStateService.isAuthenticated$;
    this.userData$ = this.authStateService.userData$;
  }

  login(): void {
    this.authStateService.login();
  }

  logout(): void {
    this.authStateService.logout();
  }
}
