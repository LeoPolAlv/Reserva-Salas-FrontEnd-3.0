import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reservas } from '../interfaces/reservas';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(
    private http: HttpClient,
  ) { }

  public reservasPorSala(nombreSala: string){
    return this.http.get<Reservas>(`${URL}/reserva/findbysala/${nombreSala}`);
  }
}
