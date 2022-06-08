export interface Sala {
    idroom: number;
    roomName: string;
    capacity: number;
    equipment: Equipment[];
    reserves: Reserve[];
  }
  
  export interface Reserve {
    idreserve: number;
    activa: boolean;
    fechaReserva: string;
    fechaHasta: string;
    titulo: string;
    descripcion: string;
    alerts: any[];
  }
  
  export interface Equipment {
    idroomeq: number;
  }
  