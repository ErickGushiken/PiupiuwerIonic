import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{ Storage } from '@ionic/storage';
import * as JWT from 'jwt-decode';
import { Usuario } from '../../modelos/usuario';


@Injectable()
export class UsuariosServiceProvider {
  token:any;
  usuario:string;
  id:number;
  senha:string;
  foto:string;
  public usuarios:Usuario[];
  


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
      // Armazena credenciais para proximo login (UX), como fazer isso de forma mais segura ?
      this.usuario=usuario;
      this.senha=senha;
    let credenciais ={username:usuario, password:senha};
    // Utilização do Promisse, recebe dois parametros de resultado positivo/negativo
    // Termos resolve/reject são convenções da linguagem
    this._http.post('http://piupiuwer.polijunior.com.br/api/login/',credenciais)
      .subscribe(resposta =>{
        console.log("OLAR",resposta['token']);
        console.log(JWT(resposta['token']));
        console.log("CRYSTAL",JWT(resposta['token'])['user_id']);
        this.token = resposta['token'];
        this.id=JWT(resposta['token'])['user_id'];
        
        this.storage.set('token',resposta['token']);
        console.log("OLHAAAA O TOKEN",this.token);
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
  }
  
  checaUsername(username){
    return new Promise((resolve)=>{
    this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
    .subscribe(
      (usuarios) =>{
        this.usuarios = usuarios;
        console.log("HELLO", usuarios);
        // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
        this.usuarios.forEach(usuario => {
          console.log("ESTOU TRABALHANDO COM CADA USUARIO",usuario);
          // Compara com os usuários já disponiveis
          if(usuario.username==username){
            console.log("Encontrei outro usuario com mesmo nome");
            resolve({
              "usernameUtilizado":true
            });
          }else{
            
            resolve(null)
          }})})})}

  procuraUsuario(username){
    return new Promise((resolve)=>{
      this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
      .subscribe(
        (usuarios) =>{
          this.usuarios = usuarios;
          console.log("HELLO", usuarios);
          // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
          this.usuarios.forEach(usuario => {
            console.log("ESTOU TRABALHANDO COM CADA USUARIO",usuario.username);
            // Compara com os usuários já disponiveis
            if(usuario.username==username){
              console.log("Encontrei o usuario",usuario);
              
              resolve(usuario);
              // Lança uma exceção para parar a função
              throw "";
              
                
            }else{
              
              console.log("não deu match");
            
            }})})})}
  }



