import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alta-reserva',
  templateUrl: './alta-reserva.component.html',
  styleUrls: ['./alta-reserva.component.scss'],
})
export class AltaReservaComponent implements OnInit {

  @Input() pais: string;
  @Input() oficina: string;
  @Input() sala: string;
  @Input() fechaReserva: Date;

  public encabezadoReserva: string = '';
  public fechaDesde: string;
  public diaActual: string;
  public fechaMax: string;
  public titulo: string = '';
  public descripcion: string = '';
  public fechaHasta: Date;

  public minuteValues: string = '0,30';
  public hourValues: any = "7,8,9,10,11,12,13,14,15,16,17,18,19,20";
  
  
  constructor(
    //private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {
    console.log('Alta Reserva - Constructor');
   }

  ngOnInit() {
    console.log('Alta Reserva - OnInit');
    //console.log('Fecha Reserva que nos envian: ',this.fechaReserva);
    this.fechaDesde = new Date(this.fechaReserva.setHours(this.fechaReserva.getHours()+1)).toISOString();
    //Inicializamos la fecha Hasta para evitar errores de undefined
    this.fechaHasta = this.fechaReserva;
    //this.fechaReserva = new Date(this.fechaDesde.setHours(this.fechaReserva.getHours()+1));
    //this.fechaDesde = new Date(this.fechaReserva).toISOString();
    //console.log('Fecha Reserva que calculo: ',this.fechaDesde);
    //this.diaActual = new Date().toISOString();
    this.fechaMax = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString();
    this.encabezadoReserva = `Realizando reserva para ${this.sala}. Oficina ${this.oficina}( ${this.pais} )`
  }

  /**
   * Cuando la pagina esta activa en ese momento.
   */
  ionViewDidEnter(){
    this.fechaHasta = this.fechaReserva;
  }

  formateoFechaHasta(fechaHasta){
    console.log('Fecha Hasta que envio: ', fechaHasta);
    this.fechaHasta = new Date(fechaHasta);
  }

  closeModel() {
    this.fechaReserva = new Date(this.fechaReserva.setHours(this.fechaReserva.getHours()-1));
    //console.log('Fecha Desde que voy a enviar: ', this.fechaReserva);
    //console.log('Fecha Hasta que voy a enviar: ', this.fechaHasta);
    //console.log('Titulo que voy a enviar: ', this.titulo);
    //console.log('Descripcion que voy a enviar: ', this.descripcion);
    //this.titulo = 'titulo que envio';
    //this.descripcion = 'descripcion que envio';

    this.validarTitDesc();
    this.validarHoras();

    return this.modalController.dismiss({
      fechaDesde: this.fechaReserva,
      fechaHasta: this.fechaHasta, 
      titulo: this.titulo,
      descripcion: this.descripcion
    });
  }
  
  validarHoras(){
    let horaDesde = 0;
    let horaHasta = 0;
    horaDesde = this.fechaReserva.getTime();
    console.log('Hora desde: ', horaDesde);
    horaHasta = this.fechaHasta.getTime();
    console.log('Hora Hasta: ', horaHasta);

    if(horaHasta == horaDesde){
      this.presentAlert('Hora Fin de Reserva no es correcta');
      return;
    }
    
  }

  validarTitDesc(){
    console.log('Titulo reserva: ', this.titulo);
    console.log('Descripcion reserva: ', this.descripcion);

    if(this.titulo == '' ){
      this.presentAlert('Debe indicar el asunto de la reserva.');
      return;
    }

    if(this.descripcion == '' ){
      this.presentAlert('Debe indicar una descripcion de la reserva.');
      return;
    }
  }

  envioTitulo(dato){
    //console.log('Datos recibidos: ', dato);
    this.titulo = dato;
  }

  envioDesc(dato){
    //console.log('Datos recibidos: ', dato);
    this.descripcion = dato;
  }

  async presentAlert(mensaje) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();

    //const { role } = await alert.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

}
