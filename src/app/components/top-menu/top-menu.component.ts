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
    // Log query parameters to debug redirect
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Redirect URL params:', urlParams.toString());

    // Subscribe to authentication state
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
        console.warn('isAuthenticated:', isAuthenticated);
      }
    );

    // Subscribe to user data
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

    // Check authentication state after redirect
    this.oidcSecurityService.checkAuth().subscribe(
      ({ isAuthenticated, userData }) => {
        this.isAuthenticated = isAuthenticated;
        this.userName =
          userData?.given_name ||
          userData?.name ||
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
        this.isAuthenticated = false;
        this.userName = null;
        if (window.sessionStorage) {
          window.sessionStorage.clear();
        }
        window.localStorage.clear();
      },
      (error) => {
        console.error('Logoff error:', error);
      }
    );
  }
}
