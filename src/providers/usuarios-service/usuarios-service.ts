import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class UsuariosServiceProvider {

  private _usuarioLogado:Usuario;


  constructor(private _http: HttpClient) {
  }

  efetuaLogin(username,password){
    console.log({username,password});
    return this._http.post<Usuario>('http://piupiuwer.polijunior.com.br/api/login/',{username,password})
    .do((usuario:Usuario)=> this._usuarioLogado = usuario);
  }

  obtemUsuarioLogado(){
    return this._usuarioLogado;
  }
}
