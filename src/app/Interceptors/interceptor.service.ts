import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  public token: string;
  public authReq: HttpRequest<any>;

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(req, next))
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.tokenService.eliminarToken();
              this.router.navigate(['login']);
            } 
            return throwError(err.message);
          })
        );
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    // if your getAuthToken() function declared as "async getAuthToken() {}"
    this.authReq = req;
    await this.tokenService.getToken()
            .then( resp => {
              //console.log('Resp en interceptor: ', resp);
              const token = resp;
              if (token !== null){
                this.authReq = req.clone({setHeaders: {'Authorization': `Bearer ${token}`}});
              }
              //console.log('authReq-dentro: ', this.authReq);
              //return next.handle(this.authReq).toPromise()
            });

    //console.log('authReq-fuera: ', this.authReq);
    
    return next.handle(this.authReq).toPromise();
  }
}
