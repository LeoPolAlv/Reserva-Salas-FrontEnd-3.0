import { Component, Input, OnInit, ViewChild } from '@angular/core';
//import { NavController } from '@ionic/angular';
import { CalendarMode, QueryMode, Step } from 'ionic2-calendar/calendar';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { WeekViewComponent } from 'ionic2-calendar/weekview';
import { DayViewComponent } from 'ionic2-calendar/dayview';
import { ReservasService } from 'src/app/services/reservas.service';
import { Reservas } from '../../interfaces/reservas';
import { Sala } from 'src/app/interfaces/sala';
import { SalasService } from 'src/app/services/salas.service';
import { Observable } from 'rxjs';
import { OficinasService } from 'src/app/services/oficinas.service';
import { Oficina } from 'src/app/interfaces/oficina';
import { Eventos } from 'src/app/interfaces/share';


@Component({
  selector: 'app-reservasala',
  templateUrl: './reservasala.component.html',
  styleUrls: ['./reservasala.component.scss'],
})
export class ReservasalaComponent implements OnInit {

  @Input() tittle: string;

  @ViewChild('calendario') calendario: CalendarComponent;

  //public diasSemana: string[] = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  public eventoReservas = [];
  public salas;
  public isDisabled: boolean = false;
  //public oficinas;
  public resultado;
  //public salaSeleccionada: string = '';
  //public eventoReservas: Reservas[] = [];
  public eventSource = [];
  public viewTitle;

  public isToday:boolean;

  //TODO: formatear las columnas de la diferentes vistas que hay en el calendar
  //FIXME: 
  public calendar = {
      mode: 'month' as CalendarMode,
      step: 30 as Step,
      currentDate: new Date(),
      startHour: 7,
      endHour: 20,
      startingDayWeek: 1,
      startingDayMonth: 1,
      showEventDetail: true,
      lockSwipes: false,
      queryMode : 'remote' as QueryMode,
      noEventsLabel: 'No hay reuniones programadas para hoy',
      dateFormatter: {
          formatMonthViewDay: function(date:Date) {
              // dias del mes en vista mes
              return date.getDate().toString();
          },
          formatMonthViewDayHeader: function(date:Date) {
              //Dia de la semana en vista mes
              return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][date.getDay()];
              //return 'MonMH';
          },
          formatMonthViewTitle: function(date:Date) {
              //titulo del mes vista mes
              return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
              [date.getMonth()];
              //return 'testMT';
          },
          formatWeekViewDayHeader: function(date:Date) {
              //Cabecera de dias de vista semana
              const nomDia = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][date.getDay()];
              return `${nomDia} ${date.getUTCDate()}`;
              //return 'MonWH';
          },
          formatWeekViewTitle: function(date:Date) {
              // Titulo de la vista week
                let fechaActual = new Date(date);
                let unoEnero = new Date(fechaActual.getFullYear(),0,1);
                const numeroDias = Math.floor((fechaActual.getTime() - unoEnero.getTime()) / (24 * 60 * 60 * 1000));
                const semana = Math.ceil(( fechaActual.getDay() + 1 + numeroDias) / 7);
                
                const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                [date.getMonth()];
                const anio = date.getFullYear().toString()

                return `${mes} ${anio}, semana ${semana}`;  
                //return 'testWT';
          },
          formatWeekViewHourColumn: function(date:Date) {
              //columna de horas en vista semana
                let horas = date.getHours();
                let minutos = date.getMinutes().toString();
                if (minutos === '0'){
                  minutos = '00'
                }
                return `${horas}:${minutos}`;
              //return 'testWH';
          },
          formatDayViewHourColumn: function(date:Date) {
              //Columna horas en vista dia
                let horas = date.getHours();
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
  };

  constructor(
      //private navController:NavController
      //private reservaService: ReservasService,
      private salaService: SalasService,
      //private oficinaService: OficinasService
      ) { 
        console.log('Constructor de Reserva Sala');
        this.cargarSalas();
                    
            /*this.oficinaService.obtenerOficinas()
                .subscribe( oficinas => {
                    this.oficinas = oficinas;
                    //this.salas = this.oficinas.rooms;
                })
            */
      }

  ionViewDidEnter(){
      console.log('ionViewDidEnter Reserva Sala');
  }

  ngOnInit() {
      console.log('On Init Reserva Sala');
  }

  async cargarSalas(){
      return await this.salaService.allSalas()
      .subscribe( salas => {
          //console.log('Salas encontradas: ', salas);
          this.salas = salas;
      });  
  }

  loadEvents(reservas) {
      //console.log('Loadevents Entrada: ', reservas);
      //this.eventSource = this.createRandomEvents();
      this.eventSource = this.cargarEventos(reservas);
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

  onViewTitleChanged(title: string) {
      console.log(title);

       // console.log('es disabled');
      if(this.isDisabled){
        this.calendario.lockSwipeToPrev = true;
      } else {
        //console.log('NO es disabled');
        this.calendario.lockSwipeToPrev = false;
      }

      this.viewTitle = title;
  }

  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
      //console.log('Change Mode: ', mode);
      this.calendar.mode = mode;
      this.loadEvents(this.eventoReservas);
  }

  /*reloadSource(start, end){

  }
*/
  today() {
      this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }


  /*createRandomEvents() {
      var events = [];
      for (var i = 0; i < 50; i += 1) {
          var date = new Date();
          var eventType = Math.floor(Math.random() * 2);
          //var eventType = 1;
          var startDay = Math.floor(Math.random() * 90) - 45;
          var endDay = Math.floor(Math.random() * 2) + startDay;
          var startTime;
          var endTime;
          if (eventType === 0) {
              //console.log('EVENTTYPE: ', eventType);
              startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
              if (endDay === startDay) {
                  endDay += 1;
              }
              endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
              events.push({
                  title: 'All Day - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: true
              });
          } else {
            //console.log('EVENTTYPE: ', eventType);
              var startMinute = Math.floor(Math.random() * 24 * 60);
              var endMinute = Math.floor(Math.random() * 180) + startMinute;
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
              endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
              events.push({
                  title: 'Event - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: false
              });
          }
      }
      return events;
  }
*/
 onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
      if(this.fechaPasada(new Date(ev.startTime))) {
        // console.log('es disabled');
         this.isDisabled = true;
         //this.calendario.lockSwipeToPrev = true;
       } else {
         //console.log('NO es disabled');
         this.isDisabled = false;
         //this.calendario.lockSwipeToPrev = false;
       }
  }

  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  }

  fechaPasada = (date:Date) => {
    var current = new Date();
    current.setHours(0,0,0);
    console.log('Date que paso a la funcion: ', date);
    console.log('Date current: ', current);
    console.log('resultado: ', date < current);
    return date < current;
  }

  next(){
      //console.log('damos siguiente: ', this.calendario);
      this.calendario.slideNext();
  }

  back(){
    //console.log('damos anterior');
    this.calendario.slidePrev();
  }

  selectSala(event){
      this.eventoReservas= [];
      //console.log('Evento: ', event.detail.value);
      //this.salaSeleccionada =  event.detail.value;
      this.buscarReservas(event.detail.value);
  }

  buscarReservas(sala: string){
      this.resultado = this.salas.filter( salaAux => {
          return salaAux.roomName == sala
      })
      console.log('Salidas despues filtro: ', this.resultado);
      this.resultado[0].reserves.forEach(reserva => {
          console.log('elemento leido: ', reserva.idReserva); 
          //this.sala = reservas.roomName; 
          //reservas.reserves.forEach(reserva => {
          //    console.log('Reserva a ingresar: ', reserva);
              this.eventoReservas.push(reserva); 
          //});  
        });
        //console.log(this.eventoReservas);
        this.loadEvents(this.eventoReservas);
      
      /*console.log('Eventos a cargar en buscar reservas: ', this.eventoReservas);  
      for (let index = 0; index < this.eventoReservas.length; index++) {
        const element = this.eventoReservas[index];
        console.log('element for: ', element);
    }*/
  }
}
