import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{ Storage } from '@ionic/storage';
import * as JWT from 'jwt-decode';
import { Usuario } from '../../modelos/usuario';
import {Events} from 'ionic-angular';


@Injectable()
export class UsuariosServiceProvider {
  token:any;
  usuario:string;
  id:number;
  senha:string;
  foto:string;
  public usuarios:Usuario[];
  email: any;
  
  constructor(private _http: HttpClient, 
    public storage: Storage,
    public events:Events,
    ) {
  }

  efetuaLogin(usuario,senha){
    return new Promise((resolve, reject)=>{
      // Armazena credenciais para proximo login (UX), como fazer isso de forma mais segura ?
      this.usuario=usuario;
      this.senha=senha;
    let credenciais ={username:usuario, password:senha};
    // Utilização do Promisse, recebe dois parametros de resultado positivo/negativo
    // Termos resolve/reject são convenções da linguagem
    this._http.post('http://piupiuwer.polijunior.com.br/api/login/',credenciais)
      .subscribe(resposta =>{
        this.token = resposta['token'];
        this.id=JWT(resposta['token'])['user_id'];
        this.email=JWT(resposta['token'])['email'];
        this.storage.set('token',resposta['token']);
        resolve(resposta);
        this.events.publish("usuario criado",usuario,this.email);
      },(erro)=>{
        reject(erro);
      });
    });
  }
  checaUsuario(){
    return new Promise((resolve,reject)=>{
      this.storage.get('token').then((valor)=>{
      this.token=valor;
      this._http.get('http://piupiuwer.polijunior.com.br/api/token-refresh/',this.token)        
        .subscribe(resposta => {
          this.token = resposta['token'];
          this.storage.set('token', resposta['token']);
          resolve(resposta);
        }, (erro) => {
          reject(erro);
        });
      });
    });
  }
  
  checaUsername(username){
    return new Promise((resolve)=>{
    this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
    .subscribe(
      (usuarios) =>{
        this.usuarios = usuarios;
        // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
        this.usuarios.forEach(usuario => {
          // Compara com os usuários já disponiveis
          if(usuario.username==username){
            resolve({
              "usernameUtilizado":true
            });
          }else{
            resolve(null)
          }
        })
      })
    })
  }

  procuraUsuario(username){
    return new Promise((resolve)=>{
      this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
      .subscribe(
        (usuarios) =>{
          this.usuarios = usuarios;
          // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
          this.usuarios.forEach(usuario => {
            // Compara com os usuários já disponiveis
            if(usuario.username==username){
              resolve(usuario);
              // Lança uma exceção para parar a função
              throw "";
            }else{
            }
          })
        })
      })
    }
  }



