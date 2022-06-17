import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginUsuario } from '../models/login.models';
import { AutenticacionService } from '../services/autentication.service';
import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formLogin: FormGroup;
  public loginUsuario: LoginUsuario;
  

  constructor( 
    private fb: FormBuilder,
    public toastController: ToastController,
    private authService: AutenticacionService,
    private tokenService:TokenService,
    private router: Router,
  ) { 
    //console.log('Estoy en el login');
  }

  ngOnInit() {
    //console.log('Onint');
    this.inicioTerminos();
  }

  ionViewWillEnter(){
    //console.log('ionViewWillEnter');
    this.inicioTerminos();
  }

  inicioTerminos(){
    this.iniFormLogin();
    this.tokenService.crearStorage();
    this.tokenService.eliminarToken();
  }

  iniFormLogin(){
    this.formLogin = this.fb.group({
      login:['',Validators.required],
      password:['', Validators.required]
    });
  }

  async login(){
    //this.loginUsuario = new LoginUsuario(this.formLogin.controls['nombreUsuario'].value , this.formLogin.controls['password'].value);
    this.loginUsuario = new LoginUsuario(this.formLogin.get('login').value, this.formLogin.get('password').value);
    //console.log('LOGIN PAGE: ',this.loginUsuario);
    await this.authService.login(this.loginUsuario)
                .subscribe(
                    async (resp: any) => {
                      await this.tokenService.setToken(resp.token) 
                            .then();
                      await this.tokenService.validaToken();
                      await this.router.navigateByUrl('folder/reservasala');
                      //console.log('Todo OK en el login');
                    },
                     err => {
                      let errorDesc= err.status;
              
                      if (errorDesc === 401){
                        errorDesc = 'Usuario no autorizado'
                      } else {
                        errorDesc = "Error en la conexion, intentelo otra vez"
                      }
                      this.presentToast(errorDesc);
                    });
  }

  async presentToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      cssClass: 'toastStyle',
      duration: 3000,
      position: 'middle',
      color: "danger"
    });
    toast.present();
  }

}
