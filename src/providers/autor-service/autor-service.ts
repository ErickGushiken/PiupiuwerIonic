import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class AutorServiceProvider {

  private _usuarios: Usuario[];

  constructor(public _http: HttpClient) {

    console.log('sou o provider do procura usuario');
    this._http.get('')
    .do((usuarios:Usuario[])=> this._usuarios=usuarios);
    console.log(this._usuarios);
    console.log("Hello world");
  }

}
