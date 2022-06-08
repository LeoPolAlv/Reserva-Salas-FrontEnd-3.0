import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { CalendarComponent, CalendarMode, Step } from 'ionic2-calendar/calendar';
import { Sala } from 'src/app/interfaces/sala';
import { Eventos } from 'src/app/interfaces/share';
import { Oficina } from 'src/app/models/oficina.models';
import { Pais } from 'src/app/models/pais.models';
import { OficinasService } from 'src/app/services/oficinas.service';
import { PaisServiceService } from 'src/app/services/pais-service.service';
import { ReservasService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-newreserva',
  templateUrl: './newreserva.component.html',
  styleUrls: ['./newreserva.component.scss'],
})
export class NewreservaComponent implements OnInit {

  @ViewChild('calendario') calendario: CalendarComponent;
  
  public viewTitle: string= '';

  public altaReservaForm: FormGroup;
  
  public paisesAux: any;
  public paisSeleccionado: Pais;
  public oficinasPais: Oficina[];
  public salas: Sala[];
  public salaSeleccionada: string;
  //public fechaSeleccionada: string;

  // Banderas de eleccion
  public paisSelecc: boolean = false;
  public oficinaSelec: boolean = false;
  public salaSelec: boolean = false;
  public isDisabled: boolean = true;

  public lockSwipes: boolean = true;
  public eventSource = [];
  public eventoReservas = [];
  public resultado;

  public calendar = {
    mode: 'day' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
    startHour: 7,
    endHour: 20,
    startingDayWeek: 1,
    startingDayMonth: 1,
    dateFormatter: {
      formatDayViewHourColumn: function(date:Date) {
        //Columna horas en vista dia
        let horas = date.getHours()
        let minutos = date.getMinutes().toString();
        if (minutos === '0'){
          minutos = '00'
        }
        return `${horas}:${minutos}`;
        //return 'testDH';
      },
      formatDayViewTitle: function(date:Date) {
          //Cabecera vista dia
        const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        [date.getMonth()];
  
        const anio = date.getFullYear().toString();
        return `${mes} ${date.getUTCDate()}, ${anio}`;
        //return 'testDT';
      }
    }
  }

  
  constructor(
    private fb: FormBuilder,
    private paisService: PaisServiceService,
    private oficinaService: OficinasService,
    private reservaService: ReservasService,
    private alertController: AlertController,
  ) {
    this.crearFormulario();
    this.buscarPaises();
   }

  ngOnInit() {
    /**
     * Ejecutamos cuando cambia el valor del check pais
     */
    this.altaReservaForm.get('pais').valueChanges
        .subscribe((pais:string) =>{
          if (pais){
            //console.log('Cambio valor pais');
            this.paisSelecc = false;
            this.oficinaSelec = false;

            this.altaReservaForm.get('oficina').setValue('');
            this.altaReservaForm.get('sala').setValue('');
            this.altaReservaForm.get('fechaReserva').setValue('');
            this.altaReservaForm.get('fechaHasta').setValue('');

            this.paisSeleccionado = this.paisesAux.find(h => h.countryName === pais );
            this.cargarOficinas(this.paisSeleccionado);
            //console.log('Pais selecionado: ', this.paisSeleccionado);
          }
    });
    /**
     * Ejecutamos cuando cambia el valor del check oficina
     */
    this.altaReservaForm.get('oficina').valueChanges
      .subscribe((oficina:any) =>{
        if (oficina) {
          //console.log('Cambio valor oficina'); 
          this.oficinaSelec = false;
    
          this.altaReservaForm.get('sala').setValue('');
          this.altaReservaForm.get('fechaReserva').setValue('');
          this.altaReservaForm.get('fechaHasta').setValue('');
    
          //console.log('Oficina Seleccionada: ', oficina);
          if (oficina !== ''){
            this.cargaSalas(oficina);
          }
        }
      });
      /**
      * Ejecutamos cuando cambia el valor del check de la sala elejida de n aoficina.
      */    
       
      this.altaReservaForm.get('sala').valueChanges
        .subscribe((sala: string) =>{
          this.eventSource = [];
          //console.log('Cambio valor sala'); 
          //console.log('Valor de Sala: ', sala);
          this.salaSelec = false;
          if (sala) {
            this.salaSeleccionada = sala;
            this.buscarReservas(this.salaSeleccionada);
            //console.log('Valor de Sala: ', this.salaSeleccionada);
            this.salaSelec = true;
          }
      });
  }

  ngAfterViewInit() {}

  crearFormulario(){
    this.altaReservaForm = this.fb.group({
      pais:['', Validators.required],
      oficina:['', Validators.required],
      sala:['', Validators.required],
      fechaReserva:['', Validators.required],
      fechaHasta:['', Validators.required]
    });
  }


  async buscarPaises(){
    await this.paisService.findPaises()
      .subscribe(paises => {
        this.paisesAux = paises;
        //console.log(this.paisesAux);
      },
      error =>{
        console.log("ERROR: ", error);
      });
  }

  cargarOficinas(paisSeleccionado: any){
    console.log('Oficinas pais: ', paisSeleccionado);
    this.paisSelecc = true;
    this.oficinasPais = paisSeleccionado.offices;
    //console.log('Oficinas por pais: ', this.oficinasPais);
  }

  cargaSalas(oficina: string){
    this.oficinaService.findSala(oficina)
      .subscribe((salas: Sala[]) =>{
       //console.log("datos Salas por oficina: ", salas);
       if (salas.length === 0){
         this.presentAlert('Oficina sin salas asignadas');
         this.salas = null;
         //this.oficinaSelec = false
        } else {
          this.salas = salas
          this.oficinaSelec = true
        }
      //console.log("datos Salas por oficina despues: ", this.salas);
    });
  }

  buscarReservas(sala: string){
    this.resultado = [];
    this.eventoReservas = [];

    this.resultado = this.salas.filter( salaAux => {
      console.log('SalaAux: ', salaAux);
        return salaAux.roomName == sala
    })
    //console.log('Salidas despues filtro: ', this.resultado);
    this.resultado[0].reserves.forEach(reserva => {
        this.eventoReservas.push(reserva); 
      });
      //console.log(this.eventoReservas);
      this.eventSource = this.cargarEventos(this.eventoReservas);
  }

  cargarEventos(reservas): Eventos[] {
    //console.log('reservas que llegan: ',reservas);
    let eventos: any[] = [];
    reservas.forEach(reserva => {
        console.log('Reserva: ',reserva);
        //console.log('fecha desde: ',reserva.fechaReserva);
        //console.log('fecha hasta: ',reserva.fechaHasta);
        const startTimeAux = new Date(reserva.fechaReserva);
        //console.log('startTimeAux: ',startTimeAux);
        const startTime = new Date(startTimeAux.getUTCFullYear(), startTimeAux.getUTCMonth(), startTimeAux.getUTCDate(),startTimeAux.getHours(),startTimeAux.getMinutes());
        //console.log('startTime: ',startTime);
        let endTimeAux = new Date(reserva.fechaHasta);
        //console.log('endTimeAux: ',endTimeAux);
        let endTime = new Date(endTimeAux.getUTCFullYear(), endTimeAux.getUTCMonth(), endTimeAux.getUTCDate(),endTimeAux.getHours(),endTimeAux.getMinutes());
        //console.log('endTime: ',endTime);
        eventos.push({
            title: `${reserva.titulo} - ${reserva.descripcion}`,
            startTime: startTime,
            endTime: endTime,
            allDay: false
        });    
  
    });
    //console.log('Eventos cargados: ',eventos);
    return eventos;
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

  altaReserva() {
    console.log('Alta de reserva');
  }


  /***************************************************************
   * funciones de customizacion del objeto calendar
   * *************************************************************
   */
  onViewTitleChanged(title: string) {
    //console.log('Titulo: ', title);
    if(this.fechaPasada(new Date(title))) {
     // console.log('es disabled');
      this.isDisabled = true;
      this.calendario.lockSwipeToPrev = true;
    } else {
      //console.log('NO es disabled');
      this.isDisabled = false;
      this.calendario.lockSwipeToPrev = false;
    }
    this.viewTitle = title;
  }

 

  next(){
    //console.log('damos siguiente: ', this.calendario);
    this.calendario.slideNext();
  }
  
  back(){
    //console.log('damos atras');
    this.calendario.slidePrev();
  }

  markDisabled = (date:Date) => {
    var current = new Date();
    current.setHours(
      current.getHours(), 
      current.getMinutes(), 
      current.getSeconds()
    );
    return date < current;
  }

  fechaPasada = (date:Date) => {
    var current = new Date();
    current.setHours(0,0,0);
    //console.log('Date que paso a la funcion: ', date);
    //console.log('Date current: ', current);
    //console.log('resultado: ', date < current);
    return date < current;
  }

  onTimeSelected(ev) {

    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
        (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }
}
