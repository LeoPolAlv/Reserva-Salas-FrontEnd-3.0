import { EventEmitter, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import jwt_decode from 'jwt-decode';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public usuarioConect: string = '';
  public roleConect: string = '';
  public isLogged: boolean = false;
  public token: string;

  //Declaramos un evento que se lanzara cada vez que se cree una nueva reserva.
  public nuevoToken: EventEmitter<string> = new EventEmitter<string>();
  public logeado: EventEmitter<string> = new EventEmitter<string>();

  get tokenConecct(){
    return this.token;
  }
  get isLoggedIn(){
    return this.isLogged;
  }
  
  constructor( 
    private nativeStorage: Storage,
  //  private autenticacionService: AutenticacionService,
    ) {
      this.crearStorage();
      //console.log('En token Service');
      this.isLogged = false;
      this.token = '';
  }
 
  async crearStorage(){
    await this.nativeStorage.create();
  }

  async getToken(){
    //console.log('Get token: ', this.nativeStorage.get('reservasala'));
    try {
      this.token = await this.nativeStorage.get('reservasala');
      if(this.token !== '')
        return this.token;
      return null;
    } catch (error) {
    //   console.log('Error al buscar el token en el localStorage');
       return null; 
    }
  }

  getTokenObservable(): Observable<string> {
    return from(this.getToken());
  }

  async setToken( token:string){
    console.log('guardo token: ', token);
    await this.nativeStorage.set('reservasala',token);
    //this.token = token;
    this.nuevoToken.emit(token);
  }

  eliminarToken(){
    this.nativeStorage.remove('reservasala');
    this.token = '';
    this.logeado.emit('');
  }

  async validaToken(){
    this.token = await this.nativeStorage.get('reservasala');
    //this.getToken().then( (token) => this.token = token);
    if (this.token){
      this.isLogged = true;
      //console.log('logged true ');
    } else {
      this.isLogged = false;
      //console.log('logged false ');
    }

    //console.log('Islogged?: ', this.isLogged);
    this.logeado.emit(this.token);
    return this.isLogged;
  }

  userToken(token: string) {
    //console.log('Token Usuario: ', jwt_decode(this.token)['sub']);
    if (token){
      return this.usuarioConect = jwt_decode(token)['sub'];
    }
    return '';
  }

  roleToken(token: string) {
    if(token){
      //console.log('Token Role: ', jwt_decode(this.token)['roles']);
      return this.roleConect = jwt_decode(token)['roles'];
    }
    return '';
  }
}

