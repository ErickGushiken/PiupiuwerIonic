import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class CadastroServiceProvider {
  private _usuarioLogado:Usuario;

  constructor(private _http: HttpClient) {

    
  }

  efetuaCadastro(username,password,first_name,last_name,email){
    console.log(username,password,first_name,last_name,email);
    return this._http.post<Usuario>('http://piupiuwer.polijunior.com.br/api/usuarios/registrar/',{username, password,first_name,last_name,email})
    .do((usuario:Usuario)=> this._usuarioLogado=usuario);
  }

    obtemUsuarioLogado2(){
      return this._usuarioLogado;
    }


}
