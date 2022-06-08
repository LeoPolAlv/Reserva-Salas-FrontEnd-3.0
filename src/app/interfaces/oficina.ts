export interface Oficina {
  idoffice: number;
  officename: string;
  rooms: Room[];
  users: User [];
}

interface User {
  idUser: number;
  dasUser: string;
  email: string;
  password: string;
  rol: string;
  msgreserve: boolean;
  msgalert: boolean;
  estadoUser: boolean;
  reserves: any[];
  alerts: any[];
}

interface Room {
  idroom: number;
  roomName: string;
  capacity: number;
  equipment: Equipment[];
  reserves: Reserve[];
}

interface Reserve {
  idreserve: number;
  activa: boolean;
  fechaReserva: string;
  fechaHasta: string;
  titulo: string;
  descripcion: string;
  alerts: any[];
}

interface Equipment {
  idroomeq: number;
}