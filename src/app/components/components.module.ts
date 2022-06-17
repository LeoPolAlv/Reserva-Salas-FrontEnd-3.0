import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AltaReservaComponent } from './alta-reserva/alta-reserva.component';



@NgModule({
  declarations: [
    AltaReservaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    AltaReservaComponent,
  ]
})
export class ComponentsModule { }
