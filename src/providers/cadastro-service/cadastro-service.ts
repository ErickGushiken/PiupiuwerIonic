import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class CadastroServiceProvider {
  private _usuarioLogado:Usuario;

  constructor(private _http: HttpClient) {
  }
  efetuaCadastro(formulario1,formulario2){
    // Extrai os dados dos formularios
    formulario2.value['password'],
    formulario1.value['last_name'],
    formulario1.value['first_name'],
    formulario1.value['email'];
    var username = formulario2.value['username'];
    var password=formulario2.value['password'];
    var first_name=formulario1.value['first_name'];
    var last_name=formulario1.value['last_name'];
    var email=formulario1.value['email'];
    return this._http.post<Usuario>('http://piupiuwer.polijunior.com.br/api/usuarios/registrar/',
      {username,
       password,
       first_name,
       last_name,
       email,
    })
    .do((usuario:Usuario)=> this._usuarioLogado=usuario);
  }
    obtemUsuarioLogado2(){
      return this._usuarioLogado;
    }
}
