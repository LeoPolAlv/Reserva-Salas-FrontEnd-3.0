import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { CalendarComponent, CalendarMode, Step } from 'ionic2-calendar/calendar';
import { delay } from 'rxjs/operators';
import { Sala } from 'src/app/interfaces/sala';
import { Eventos } from 'src/app/interfaces/share';
import { Oficina } from 'src/app/models/oficina.models';
import { Pais } from 'src/app/models/pais.models';
import { OficinasService } from 'src/app/services/oficinas.service';
import { PaisServiceService } from 'src/app/services/pais-service.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { AltaReservaComponent } from '../../components/alta-reserva/alta-reserva.component';
import { AltaReserva } from '../../interfaces/reservas';
import { TokenService } from '../../services/token.service';

//TODO: Necesito controlar las horas de reservas y que no se sobrepongan unas a otras. 

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
  public fechaReservaArray: Date[];
  public fechaHastaArray: Date[];
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

  public token: string = '';
  public userToken: string = '';


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
        let minutos = date.getMinutes().toLocaleString();
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

  modal: HTMLElement;

  get calendarDisponible(): boolean {

    if(this.paisSelecc && this.oficinaSelec && this.salaSelec){
      return true;
    }
    return false;
  }

  constructor(
    private fb: FormBuilder,
    private paisService: PaisServiceService,
    private oficinaService: OficinasService,
    private reservaService: ReservasService,
    private alertController: AlertController,
    public modalController: ModalController,
    public tokenService: TokenService,
  ) {
    console.log('Nueva Reserva - Constructor');
    this.obtenrUserToken();
    this.crearFormulario();
    this.buscarPaises();
   }

  ngOnInit() {
    /**
     * Ejecutamos cuando cambia el valor del check pais
     */
    console.log('Nueva Reserva - ngOnInit');
    this.buscarPaises();

    this.altaReservaForm.get('pais').valueChanges
        .subscribe((pais:string) =>{
          if (pais){
            //console.log('Cambio valor pais');
            this.paisSelecc = false;
            this.oficinaSelec = false;

            this.altaReservaForm.get('oficina').setValue('');
            this.altaReservaForm.get('sala').setValue('');
            //this.altaReservaForm.get('fechaReserva').setValue('');
            //this.altaReservaForm.get('fechaHasta').setValue('');

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
          //this.altaReservaForm.get('fechaReserva').setValue('');
          //this.altaReservaForm.get('fechaHasta').setValue('');
    
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

    //Observable que salta cuando tenemos nueva reserva realizada y asi refrescamos la info de las reservas hechas.
    this.reservaService.nuevaReserva
          .pipe(delay(100))
          .subscribe( (evento) =>{
            console.log('Datos que envia el emmitter: ', evento);
            this.eventSource.push(evento);
            console.log('Eventos cargados: ', this.eventSource);
            this.calendario.loadEvents();
          });
  }

  async obtenrUserToken(){
    await this.tokenService.getToken().then( token => {
      this.token = token
      console.log('Tken obtenido en constructor: ', this.token);
    }); 
    console.log('Tken en la nueva reserva: ', this.token);
    this.userToken = this.tokenService.userToken(this.token);
    console.log('user en la nueva reserva: ', this.userToken);
  }

  crearFormulario(){
    this.altaReservaForm = this.fb.group({
      pais:['', Validators.required],
      oficina:['', Validators.required],
      sala:['', Validators.required],
      titulo:['', Validators.required],
      descripcion:['', Validators.required],
      fechaReserva:['', Validators.required],
      fechaHasta:['', Validators.required]
    });
  }

  inicializarForm(){
    this.paisSelecc = false;
    this.oficinaSelec = false;
    this.salaSelec = false;
    
    this.altaReservaForm.controls['pais'].setValue("");
    this.altaReservaForm.controls['oficina'].setValue("");
    this.altaReservaForm.controls['sala'].setValue("");
    this.altaReservaForm.controls['titulo'].setValue("");
    this.altaReservaForm.controls['descripcion'].setValue("");
    this.altaReservaForm.controls['fechaReserva'].setValue("");
    this.altaReservaForm.controls['fechaHasta'].setValue("");
  }

  async buscarPaises(){
    await this.paisService.findPaises()
      .subscribe( paises => {
        this.paisesAux = paises;
        console.log(this.paisesAux);
      },
      error =>{
        console.log("ERROR: ", error);
      });
  }

  cargarOficinas(paisSeleccionado: any){
    //console.log('Oficinas pais: ', paisSeleccionado);
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
    //console.log('Buscando reservas');
    this.resultado = [];
    this.eventoReservas = [];

    this.resultado = this.salas.filter( salaAux => {
      //console.log('SalaAux: ', salaAux);
      return salaAux.roomName == sala
    })
    //console.log('Salidas despues filtro: ', this.resultado);
    this.resultado[0].reserves.forEach(reserva => {
      //console.log('Reserva: ', reserva);
        this.eventoReservas.push(reserva); 
      });
      //console.log(this.eventoReservas);
      this.eventSource = this.cargarEventos(this.eventoReservas);
      this.calendario.loadEvents();
      //console.log('Eventos cargados: ', this.eventSource);
  }

  cargarEventos(reservas): Eventos[] {
    //console.log('reservas que llegan: ',reservas);
    let eventos: any[] = [];
    reservas.forEach(reserva => {
        //console.log('Reserva: ',reserva);
        //console.log('fecha desde: ',reserva.fechaReserva);
        //console.log('fecha hasta: ',reserva.fechaHasta);
        const startTimeAux = new Date(reserva.fechaReserva);
        //console.log('startTimeAux: ',startTimeAux);
        //const startTime = new Date(startTimeAux.getUTCFullYear(), startTimeAux.getUTCMonth(), startTimeAux.getUTCDate(),startTimeAux.getHours(),startTimeAux.//getMinutes());
        //console.log('startTime: ',startTime);
        let endTimeAux = new Date(reserva.fechaHasta);
        //console.log('endTimeAux: ',endTimeAux);
        //let endTime = new Date(endTimeAux.getUTCFullYear(), endTimeAux.getUTCMonth(), endTimeAux.getUTCDate(),endTimeAux.getHours(),endTimeAux.getMinutes());
        //console.log('endTime: ',endTime);
        /*eventos.push({
            title: `${reserva.titulo} - ${reserva.descripcion}`,
            startTime: startTime,
            endTime: endTime,
            allDay: false
        });*/
        eventos.push(this.eventoCalendar(reserva.titulo,reserva.descripcion,startTimeAux,endTimeAux)); 
  
    });
    //console.log('Eventos cargados: ',eventos);
    return eventos;
  }

  /*
  * Generamos un evento a mostrar en el calendario
  */
  eventoCalendar(titulo: string,desc: string, start: Date, end: Date){
    let evento:any = null;

    const startTime = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(),start.getHours(),start.getMinutes());
    const endTime = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(),end.getHours(),end.getMinutes());

    evento = {
      title: `${titulo} - ${desc}`,
      startTime: startTime,
      endTime: endTime,
      allDay: false
    };
    return evento;   
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
    //console.log('Alta de reserva');
    //console.log('Datos formulario: ', this.altaReservaForm.value);

    const nuevaReserva: AltaReserva = {};

    nuevaReserva.roomName = this.altaReservaForm.get('sala').value;
    nuevaReserva.dasUser = this.userToken;
    nuevaReserva.fechaReserva = this.altaReservaForm.get('fechaReserva').value;
    nuevaReserva.fechaHasta = this.altaReservaForm.get('fechaHasta').value;
    nuevaReserva.titulo = this.altaReservaForm.get('titulo').value;
    nuevaReserva.descripcion = this.altaReservaForm.get('descripcion').value;

    this.reservaService.altaReserva(nuevaReserva)
          .subscribe({
            next: async (resp) => {
      //        console.log('Respuesta del alta de reserva: ', resp);
              //enviamos el evento dado de alta en la BD dentro del emit.
              //this.reservaService.nuevaReserva.emit(evento);

              let mensaje = `Reserva numero:  ${resp}  realizada correctamente`;
              await this.presentAlert( mensaje );

              this.inicializarForm();
            },
            error: (err) => console.log('Error en el alta de reserva: ', err)
          });
    //console.log('fecha desde form: ', this.altaReservaForm.get('fechaReserva').value);
  }

  cancelaOperacion(){
    this.fechaReservaArray = [];
    this.fechaHastaArray = [];
  }

  async modalAltaReserva(fechaReserva: Date) {
    
    const modal = await this.modalController.create({
      component: AltaReservaComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        'pais': this.altaReservaForm.get('pais').value,
        'oficina': this.altaReservaForm.get('oficina').value,
        'sala': this.altaReservaForm.get('sala').value,
        'fechaReserva': fechaReserva,
      }
    });

    modal.onDidDismiss().then((modelData) => {
      let evento:any = null;
      this.altaReservaForm.controls['fechaHasta'].setValue('');

      if (modelData !== null){
        this.altaReservaForm.controls['fechaReserva'].setValue(modelData.data.fechaDesde);
        this.altaReservaForm.controls['fechaHasta'].setValue(modelData.data.fechaHasta);
        this.altaReservaForm.controls['titulo'].setValue(modelData.data.titulo);
        this.altaReservaForm.controls['descripcion'].setValue(modelData.data.descripcion);

        // Creamos el evnto caledar para incorporarlo a la vista del calendario
        evento = this.eventoCalendar(modelData.data.titulo,modelData.data.descripcion,modelData.data.fechaDesde,modelData.data.fechaHasta);
        //enviamos el evento dado de alta en la BD dentro del emit.
        this.reservaService.nuevaReserva.emit(evento);
      } 
      
    });
    return await modal.present();
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
     return date < current;
  }

  async onTimeSelected(ev) {
    //console.log('EV: ', ev);
    //console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
    //    (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);

    if (!this.calendarDisponible){
      //console.log('***** Se debe de elejir los datos de arriba.');
      //console.log('Pais Seleccionado? ', this.paisSelecc);
      //console.log('Oficina Seleccionada? ', this.oficinaSelec);
      //console.log('Sala Seleccionada? ', this.salaSelec);
      this.presentAlert('Debe seleccionar antes los campos Pais, Oficina y Sala');
      return;
    }

    if((ev.disabled) || (ev.events !== undefined && ev.events.length !== 0)) {
      //NO esta disponible la sala
      //div.calendar-event-wrap
      //console.log('***** Sala NO disponible');
      this.presentAlert('Horario NO disponible');
    } else {
      //Esta disponible la sala
      //console.log('******* Sala disponible');
      //const fechaReservaAux = new Date(ev.selectedTime); 
      //const fechaReserva = new Date(fechaFormatear.setHours(fechaFormatear.getHours()-1));
      //this.altaReservaForm.controls['fechaReserva'].setValue(fechaReservaAux);
      //console.log('fecha desde from: ', this.altaReservaForm.get('fechaReserva').value);
      await this.modalAltaReserva(new Date(ev.selectedTime));
      //console.log('fecha desde form despues modal: ', this.altaReservaForm.get('fechaReserva').value);
     // const fechaDesde = new Date(this.altaReservaForm.get('fechaReserva').value.setHours(this.altaReservaForm.get('fechaReserva').value.getHours()-1));
      //this.altaReservaForm.controls['fechaReserva'].setValue(fechaDesde);
      /*const fechaHasta = new Date(ev.selectedTime);
      fechaHasta.setTime(fechaReserva.getTime() + (30 * 60 * 1000));
      this.fechaReservaArray.push(fechaReserva);
      this.fechaHastaArray.push(fechaHasta);
      
      this.altaReservaForm.controls['fechaHasta'].setValue(this.fechaHastaArray);*/
    }
  }
}
