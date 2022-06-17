import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public folderID: number;


  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log('ID:' , this.folder);

    switch (this.folder) {
      case 'reservasala':
        this.folder = 'Reservas Por Sala';
        this.folderID = 1;
        break;

      case 'newreserva':
        this.folder = 'Nueva Reserva';
        this.folderID = 2;
        break;
    
      default:
        break;
    }

    if(this.folder === 'reservasala'){
      this.folder = 'Reservas Por Sala';
      this.folderID = 1;
    }
  }

}
