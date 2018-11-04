import { Usuario } from "./usuario";

export interface Post{
    id:number;
    favoritado:boolean;
    conteudo:string;
    data:Date;
    usuario:Usuario;
    tempoRelativo:any;
    autor:string;
    image:any;
}
