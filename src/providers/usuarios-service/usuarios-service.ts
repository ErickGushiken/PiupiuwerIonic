import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import{ Storage } from '@ionic/storage';
import * as JWT from 'jwt-decode';


@Injectable()
export class UsuariosServiceProvider {
  token:any;


  constructor(private _http: HttpClient, public storage: Storage,) {
  }
  // Correto modo antigo
  // efetuaLogin(username,password){
  //   console.log({username,password});
  //   return this._http.post<Usuario>('http://piupiuwer.polijunior.com.br/api/login/',{username,password})
  //   .do((usuario:Usuario)=> this._usuarioLogado = usuario);
  // }
  // obtemUsuarioLogado(){
  //   return this._usuarioLogado;
  // }

  efetuaLogin(usuario,senha){
    return new Promise((resolve, reject)=>{
    let credenciais ={username:usuario, password:senha};
    // Utilização do Promisse, recebe dois parametros de resultado positivo/negativo
    // Termos resolve/reject são convenções da linguagem
    this._http.post('http://piupiuwer.polijunior.com.br/api/login/',credenciais)
      .subscribe(resposta =>{
        console.log("OLAR",resposta['token']);
        console.log(JWT(resposta['token']));
        console.log("CRYSTAL",JWT(resposta['token'])['user_id']);
        this.token = resposta['token'];
        this.storage.set('token',resposta['token']);
        resolve(resposta);
      },(erro)=>{
        reject(erro);
      });
    });
  }
  checaUsuario(){
    console.log("entrei na checausuario service");
    return new Promise((resolve,reject)=>{
      this.storage.get('token').then((valor)=>{
      this.token=valor;
      this._http.get('http://piupiuwer.polijunior.com.br/api/token-refresh/',this.token)        
        .subscribe(resposta => {
          console.log("OLAR_CHECK",resposta['token']);
          this.token = resposta['token'];
          this.storage.set('token', resposta['token']);
          resolve(resposta);
        }, (erro) => {
          reject(erro);
        });
      });
    });
  }}