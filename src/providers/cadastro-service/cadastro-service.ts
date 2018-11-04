import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class CadastroServiceProvider {
  private _usuarioLogado:Usuario;
  private headers: HttpHeaders;

  constructor(private _http: HttpClient) {
  }
  efetuaCadastro(formulario1,formulario2){
    
    // Extrai os dados dos formularios
    formulario2.value['password'],
    formulario1.value['last_name'],
    formulario1.value['first_name'],
    formulario1.value['email'];
    var Username = formulario2.value['username'];
    var Password=formulario2.value['password'];
    var First_name=formulario1.value['first_name'];
    var Last_name=formulario1.value['last_name'];
    var Email=formulario1.value['email'];
    let cadastro={
      username:Username,
      password:Password,
      first_name:First_name,
      last_name:Last_name,
      email:Email,
    };
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log("sajsakjdnasjkdak",cadastro);
    return this._http.post<Usuario>('http://piupiuwer.polijunior.com.br/api/usuarios/registrar/',cadastro,{headers:this.headers})
    .do((usuario:Usuario)=> this._usuarioLogado=usuario);
  }
    obtemUsuarioLogado2(){
      return this._usuarioLogado;
    }
}
