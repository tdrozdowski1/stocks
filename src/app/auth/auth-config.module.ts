import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_i9ivjsuMD',
        redirectUrl: 'https://main.d1kexow7pbduqr.amplifyapp.com/',
        postLogoutRedirectUri: 'https://main.d1kexow7pbduqr.amplifyapp.com/',
        clientId: 'istc6rrsed9f2jnguse7c6pk0',
        scope: 'email openid phone',
        responseType: 'code'
      },
    }),
  ],
    exports: [AuthModule],
})
export class AuthConfigModule {}
