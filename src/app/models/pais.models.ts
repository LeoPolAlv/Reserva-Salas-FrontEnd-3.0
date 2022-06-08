import { Oficina } from "./oficina.models";

export class Pais{
    public idPais: number;
    public countryName: string;
    public offices: Oficina[];

    constructor(idPais:number, countryName: string, offices: any[]=[]){
        this.idPais = idPais;
        this.countryName = countryName;
        this.offices = offices;
    }
}