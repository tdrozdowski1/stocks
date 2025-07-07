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

    // Check if redirected from logout
    if (urlParams.get('logout')) {
      this.clearAuthState();
    }

    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
      console.warn('isAuthenticated:', isAuthenticated);
    });

    this.oidcSecurityService.userData$.subscribe((userData) => {
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
      },
    );

    // Debug ID token on init
    this.oidcSecurityService.getIdToken().subscribe(
      (idToken) => console.log('ID Token on init:', idToken),
      (error) => console.error('ID Token error on init:', error),
    );
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('Logout button clicked');
    this.oidcSecurityService.getIdToken().subscribe(
      (idToken) => {
        if (!idToken) {
          console.error('No ID token available');
          this.redirectToCognitoLogout();
          return;
        }
        console.log('ID Token:', idToken);
        // Try logoff with a custom logout URL to ensure client_id is included
        const logoutUrl = this.buildCognitoLogoutUrl(idToken);
        this.oidcSecurityService.logoff(logoutUrl).subscribe(
          () => {
            console.log('Logoff successful');
            this.clearAuthState();
          },
          (error) => {
            console.error('Logoff error:', error);
            console.log('Error details:', JSON.stringify(error, null, 2));
            this.redirectToCognitoLogout(idToken); // Fallback
          },
        );
      },
      (error) => {
        console.error('Error retrieving ID token:', error);
        this.redirectToCognitoLogout();
      },
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

  private buildCognitoLogoutUrl(idToken: string): string {
    const clientId = 'istc6rrsed9f2jnguse7c6pk0';
    const logoutUri = 'https://main.d1kexow7pbduqr.amplifyapp.com/';
    const cognitoDomain = 'https://us-east-1i9ivjsumd.auth.us-east-1.amazoncognito.com';
    return `${cognitoDomain}/logout?client_id=${clientId}&id_token_hint=${idToken}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }

  private redirectToCognitoLogout(idToken?: string): void {
    const clientId = 'istc6rrsed9f2jnguse7c6pk0';
    const logoutUri = 'https://main.d1kexow7pbduqr.amplifyapp.com/';
    const cognitoDomain = 'https://us-east-1i9ivjsumd.auth.us-east-1.amazoncognito.com';
    let logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    if (idToken) {
      logoutUrl += `&id_token_hint=${idToken}`;
    }
    console.log('Redirecting to Cognito logout:', logoutUrl);
    this.clearAuthState();
    window.location.href = logoutUrl;
  }
}
