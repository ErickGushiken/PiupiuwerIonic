
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuariosServiceProvider } from '../usuarios-service/usuarios-service';
import * as moment from "moment";
import { Usuario } from '../../modelos/usuario';
import { Post } from '../../modelos/post';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@Injectable()

export class PostServiceProvider {
  
  private headers: HttpHeaders;
  public usuarios:Usuario[];
  public usuario:Usuario;
  public posts:Post[];
  public post:Post;
  
  constructor(private _http: HttpClient,
    public usuarioService:UsuariosServiceProvider,
    private _alertCtrl:AlertController,
    ) {
  }



  criaPost(conteudo){
    console.log("SOU O TOKEN ANTES DA REQUISIÇÂO",this.usuarioService.token);
    // Criar as variaveis para autenticação
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'JWT '+this.usuarioService.token,
    });
    return new Promise((resolve,reject)=>{
      this._http.post('http://piupiuwer.polijunior.com.br/api/pius/',conteudo,{headers:this.headers})
      .subscribe(resposta=>{
        resolve(resposta);
      }, (erro)=>{
        reject(erro);
      });
    });
  }

  adicionaAutor(post){
    return new Promise((resolve,reject)=>{
    this._http.get<Usuario[]>('http://piupiuwer.polijunior.com.br/api/usuarios/')
    .subscribe(
      (usuarios) =>{
        this.usuarios = usuarios;
        // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
        this.usuarios.forEach(usuario => {
          if(usuario.id==post.usuario.id){
            post.autor=usuario.username;
            return
          }
        });
        resolve(usuarios);
      },(erro)=>{
        reject(erro);
      }
    )}
  )};

  deletaPost(post){
    if (post.autor==this.usuarioService.usuario){
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'JWT '+this.usuarioService.token,
      });
    }else{
    }
  
    return new Promise((resolve,reject)=>{
    this._http.delete('http://piupiuwer.polijunior.com.br/api/pius/'+post.id,{headers:this.headers})
    .subscribe(
      (resposta)=>{
        // Zera o parametro
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':'JWT '+0,
        });
        resolve(resposta);
        },
        (erro)=>{this._alertCtrl.create({
          title:"Ocorreu um problema",
          subTitle:"Você não está autorizado a deletar esse post",
          buttons:[{text:"ok"}]
        }).present();
        reject(erro);
      }
    )})      
  }

  favoritaPost(post){
    var favoritar={};
    if (post.autor==this.usuarioService.usuario){
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'JWT '+this.usuarioService.token,
      });
    }else{
    }
  if(post.favoritado){
    favoritar={
    favoritado:false
    };
  }else{
  favoritar={
    favoritado:true
  };};
  return new Promise((resolve,reject)=>{
  this._http.patch('http://piupiuwer.polijunior.com.br/api/pius/'+post.id,favoritar,{headers:this.headers})
  .subscribe(
    (resposta)=>{
      // Zera o parametro
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'JWT '+0,
      });
      resolve(resposta);
    },
    (erro)=>{this._alertCtrl.create({
      title:"Ocorreu um problema",
      subTitle:"Você não está autorizado a favoritar esse post",
      buttons:[{text:"ok"}]
    }).present();
    reject(erro);
    })
  })}
}

