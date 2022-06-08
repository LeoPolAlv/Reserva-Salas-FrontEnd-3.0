export class Sala {

    public idroom: number;
    public roomName: string;
    public capacity: number;
    public equipment: any;
    public reserves: any

    constructor(idRoom: number, roomName: string,  capacity: number, equipament: any, reserves: any){
        this.idroom = idRoom;
        this.roomName = roomName;
        this.capacity = capacity;
        this.equipment = equipament;
        this.reserves = reserves;
    }
}
