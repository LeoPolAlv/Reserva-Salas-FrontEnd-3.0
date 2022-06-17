import { Component, OnInit } from '@angular/core';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Nueva Reserva', url: '/folder/newreserva', icon: 'create' },
    { title: 'Reservas por sala', url: '/folder/reservasala', icon: 'calendar' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'LogOut', url: '/login', icon: 'log-out' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  //public loginOk: boolean = false;

  public loginOk: boolean;
  public token: string;
  public userToken: string;

  constructor(
    private tokenService:TokenService,
  ) {}

  ngOnInit(): void {
    this.tokenService.logeado.subscribe({
      next: resp => {
        //console.log('resp de logeado: ', resp);
        this.loginOk = false;
        this.token = resp;
        if (this.token){
          this.userToken = this.tokenService.userToken(this.token);
          //console.log('Usuario: ', this.userToken);
          this.loginOk = true;
        }
        //console.log('resp de logeado2: ', this.loginOk);
      }
    });
    
    //console.log('Tken que tengo: ', this.token);
  }

    
}
