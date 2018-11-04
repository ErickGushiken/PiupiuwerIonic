import { FormControl } from "@angular/forms";
import { UsuariosServiceProvider } from "../providers/usuarios-service/usuarios-service";
import { Injectable, Component } from "@angular/core";
import { Usuario } from "../modelos/usuario";
import { HttpClient } from "@angular/common/http";
import { Post } from "../modelos/post";



@Injectable()
export class UsernameValidador {
  public usuarios:Post[];
  private _http: HttpClient;
    constructor(
      _usuarios:UsuariosServiceProvider,
      
    ){
      console.log(_usuarios.usuarios);
      // this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
      //   .subscribe(
      //     (usuarios) =>{
      //       // this.usuarios = usuarios;
      //     })
      //   console.log("ALO", this.usuarios);

    }}
//     checaUsername(control:FormControl):any{

      
//         return new Promise((resolve)=>{
//         // _http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
//         // .subscribe(
//         //   (usuarios) =>{
//         //     this.usuarios = usuarios;
//             console.log("HELLO", this.usuarios);
//             // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
//             this.usuarios.forEach(usuario => {
//               console.log("ESTOU TRABALHANDO COM CADA USUARIO",usuario);
//               // Compara com os usuários já disponiveis
//               if(usuario.username==control.value){
//                 console.log("Encontrei outro usuario com mesmo nome");
//                 console.log("CHEGUEI NO VALIDADOR",control.value);
        
//         console.log("FINALMENTE");
//                 resolve({
//                   "usernameUtilizado":true
//                 });
//               }else{
                
//                 resolve(null)
//               }})})
//             // })
        
   
//     // return new Promise(resolve => {
      
//     //     this._usuarioService.checaUsername(control.value).then((res) => {
//     //       if(res){
//     //         resolve(null);
//     //       }
//     //     }, (err) => {
//     //       resolve({'usernameInUse': true});
//     //     });
 
        
 
//     // });
//   }
 
// }