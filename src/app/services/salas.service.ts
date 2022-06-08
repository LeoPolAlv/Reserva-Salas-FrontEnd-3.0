import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sala } from '../interfaces/sala';
import { environment } from 'src/environments/environment';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor(
    private http: HttpClient,
  ) { }


  public allSalas(){

    const url = `${URL}/room/findall`;

    return this.http.get<Sala>(url);
  }

}
