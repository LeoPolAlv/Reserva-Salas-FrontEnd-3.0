export class LoginUsuario{
    public username: string;
    public password: string;

    constructor(login: string, password: string){
        this.username = login;
        this.password = password;
    }
}