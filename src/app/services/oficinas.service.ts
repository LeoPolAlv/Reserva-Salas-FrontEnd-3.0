import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Oficina } from '../interfaces/oficina';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class OficinasService {

  constructor(
    private http: HttpClient,
  ) { }

  public obtenerOficinas(){
    return this.http.get<Oficina>(`${URL}/oficinas/all`);
  }
  
  public findSala(nombreOficina: string){
    return this.http.get(`${URL}/room/findrooms/${nombreOficina}`);
  }
}
