export class Oficina {

    public idOficina: number;
    public officename: string;
    public rooms: any[];
    public users: any[];

    constructor(idOficina: number, officename: string, rooms: any[] = [], users: any[] = [])
    {
        this.idOficina = idOficina;
        this.officename = officename;
        this.rooms = rooms;
        this.users = users
    }
}