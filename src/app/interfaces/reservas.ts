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
