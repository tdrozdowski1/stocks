import {Component, inject, OnInit} from '@angular/core';
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
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
        console.warn('authenticated: ', isAuthenticated);
      }
    );
    this.oidcSecurityService.userData$.subscribe((userData) => {
      // Extract user attributes from Cognito's userData structure
      const attributes = userData?.userData || {};
      this.userName = attributes.given_name ||
        attributes.name ||
        attributes.preferred_username ||
        attributes['custom:name'] ||
        null;
      console.log('userData:', userData); // Debug to inspect userData structure
    });
  }

  login(): void {
    this.oidcSecurityService.authorize(undefined, {
      customParams: {
        redirect_uri: 'https://main.d1kexow7pbduqr.amplifyapp.com/'
      },
      urlHandler: (url) => {
        window.location.href = url;
      }
    });
  }

  logout(): void {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    window.location.href = "https://us-east-1i9ivjsumd.auth.us-east-1.amazoncognito.com/logout?client_id=istc6rrsed9f2jnguse7c6pk0&logout_uri=https://main.d1kexow7pbduqr.amplifyapp.com/";
  }
}
