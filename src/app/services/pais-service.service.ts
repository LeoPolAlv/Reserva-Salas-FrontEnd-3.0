import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PaisServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  findPaises() {
    return this.http.get(`${URL}/pais/all`)
  }
}
