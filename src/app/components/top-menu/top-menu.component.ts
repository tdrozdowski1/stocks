import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthenticationStateService } from '../../auth/authentication-state.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
})
export class TopMenuComponent {
  authState$: Observable<{ isAuthenticated: boolean; userName: string | null }>;

  constructor(private authStateService: AuthenticationStateService) {
    this.authState$ = combineLatest([
      this.authStateService.isAuthenticated$,
      this.authStateService.userData$,
    ]).pipe(
      map(([isAuthenticated, userData]) => ({
        isAuthenticated,
        userName: userData.userName,
      })),
    );
  }

  login(): void {
    this.authStateService.login();
  }

  logout(): void {
    this.authStateService.logout();
  }
}
