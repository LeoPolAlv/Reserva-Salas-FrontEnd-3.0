import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { ReservasalaComponent } from './reservasala/reservasala.component';
import { NewreservaComponent } from './newreserva/newreserva.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FolderPageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [
    FolderPage,
    ReservasalaComponent,
    NewreservaComponent,
  ]
})
export class FolderPageModule {}
