export interface Reservas {
    idReserva: number;
    activa: boolean;
    roomName: string;
    capacity: number;
    officeRoom: string;
    countryName: string;
    titulo: string;
    descripcion: string;
    nombreEquipo: string[];
    fechaReserva: string;
    fechaHasta: string;
}

export interface AltaReserva {
    roomName?: string;
	dasUser?: string; 
	fechaReserva?: Date;
    fechaHasta?: Date;
    titulo?: string;
    descripcion?: string;
}