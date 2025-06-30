import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
})
export class TopMenuComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  configuration$ = this.oidcSecurityService.getConfiguration();
  userData$ = this.oidcSecurityService.userData$;
  isAuthenticated = false;
  userName: string | null = null;

  constructor() {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Redirect URL params:', urlParams.toString());

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
        console.warn('isAuthenticated:', isAuthenticated);
      }
    );

    this.oidcSecurityService.userData$.subscribe((userData) => {
      const attributes = userData?.userData || {};
      this.userName =
        attributes.given_name ||
        attributes.email ||
        attributes.preferred_username ||
        attributes['custom:email'] ||
        null;
      console.log('userData:', userData);
    });

    this.oidcSecurityService.checkAuth().subscribe(
      ({ isAuthenticated, userData }) => {
        this.isAuthenticated = isAuthenticated;
        this.userName =
          userData?.given_name ||
          userData?.email ||
          userData?.preferred_username ||
          userData?.['custom:name'] ||
          null;
        console.warn('checkAuth - isAuthenticated:', isAuthenticated, 'userData:', userData);
      },
      (error) => {
        console.error('checkAuth error:', error);
      }
    );
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('Logout button clicked');
    this.oidcSecurityService.logoff().subscribe(
      () => {
        console.log('Logoff successful');
        this.clearAuthState();
      },
      (error) => {
        console.error('Logoff error:', error);
        this.redirectToCognitoLogout();
      }
    );
  }

  private clearAuthState(): void {
    this.isAuthenticated = false;
    this.userName = null;
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    window.localStorage.clear();
    console.log('Auth state cleared');
  }

  private redirectToCognitoLogout(): void {
    const clientId = 'istc6rrsed9f2jnguse7c6pk0';
    const logoutUri = 'https://main.d1kexow7pbduqr.amplifyapp.com/';
    const cognitoDomain = 'https://us-east-1i9ivjsumd.auth.us-east-1.amazoncognito.com';
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    console.log('Redirecting to Cognito logout:', logoutUrl);
    this.clearAuthState(); // Clear state before redirect
    window.location.href = logoutUrl;
  }
}
