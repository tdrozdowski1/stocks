import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationStateService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<{
    userName: string | null;
  }>({ userName: null });

  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  userData$: Observable<{ userName: string | null }> = this.userDataSubject.asObservable();

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    this.oidcSecurityService.checkAuth().subscribe(
      ({ isAuthenticated, userData }) => {
        this.isAuthenticatedSubject.next(isAuthenticated);

        const userName =
          userData?.given_name ||
          userData?.email ||
          userData?.preferred_username ||
          userData?.['custom:name'] ||
          null;

        this.userDataSubject.next({ userName });

        console.log('checkAuth result:', isAuthenticated, userData);
      },
      (error) => {
        console.error('checkAuth error:', error);
        this.isAuthenticatedSubject.next(false);
        this.userDataSubject.next({ userName: null });
      }
    );
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.getIdToken().subscribe(
      (idToken) => {
        if (!idToken) {
          console.error('No ID token available');
          this.redirectToCognitoLogout();
          return;
        }
        const logoutUrl = this.buildCognitoLogoutUrl(idToken);
        this.oidcSecurityService.logoff(logoutUrl).subscribe(
          () => {
            console.log('Logoff successful');
            this.clearAuthState();
          },
          (error) => {
            console.error('Logoff error:', error);
            this.redirectToCognitoLogout(idToken);
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
    this.isAuthenticatedSubject.next(false);
    this.userDataSubject.next({ userName: null });
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
