import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class CadastroServiceProvider {
  private _usuarioLogado:Usuario;

  constructor(private _http: HttpClient) {

    
  }
  
  efetuaCadastro(formulario){
    console.log(formulario.value['username'],
    formulario.value['password'],
    formulario.value['last_name'],
    formulario.value['first_name'],
    formulario.value['email']);
    var username = formulario.value['username'];
    var password=formulario.value['password'];
    var first_name=formulario.value['first_name'];
    var last_name=formulario.value['last_name'];
    var email=formulario.value['email'];
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
