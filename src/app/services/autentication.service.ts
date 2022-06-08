import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginUsuario } from '../models/login.models';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  authURL =`${ URL }/auth/login`;

  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: LoginUsuario) {
    //console.log('--LOGIN: ', loginUsuario);
    return this.httpClient.post<LoginUsuario>(this.authURL, loginUsuario);
  }
}
