import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AltaReserva, Reservas } from '../interfaces/reservas';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  //Declaramos un evento que se lanzara cada vez que se cree una nueva reserva.
  public nuevaReserva: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    private http: HttpClient,
  ) { }

  public reservasPorSala(nombreSala: string){
    return this.http.get<Reservas>(`${URL}/reserva/findbysala/${nombreSala}`);
  }

  public altaReserva(reserva: AltaReserva){
    let url = `${URL}/reserva/new`;
    return this.http.post(url,reserva);
  }
}
