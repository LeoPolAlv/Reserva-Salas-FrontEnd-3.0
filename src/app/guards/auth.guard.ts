import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  //private paso: boolean;

  constructor(
    private tokenService:TokenService,
    private router: Router,
  ){
   // console.log('Constructor guard');
  }
  

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {
   // state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.tokenService.validaToken()
            .then(resp => {
               //console.log('Respuesta en guard:',resp);
               if (!resp){
                this.router.navigateByUrl('/login');         
               }
               return resp;
            });
  }
  
}
