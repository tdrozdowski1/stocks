import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthenticationStateService} from "./authentication-state.service";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authStateService: AuthenticationStateService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authStateService.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          // Store the attempted URL for redirecting back after login
          sessionStorage.setItem('returnUrl', state.url);
          // Redirect to Cognito login
          this.oidcSecurityService.authorize();
        }
      }),
      map((isAuthenticated) => isAuthenticated)
    );
  }
}
