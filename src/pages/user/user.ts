import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Img, LoadingController } from 'ionic-angular';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import * as JWT from 'jwt-decode';
import { urlToNavGroupStrings } from 'ionic-angular/umd/navigation/url-serializer';
import { ReadVarExpr, UrlResolver } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../modelos/post';
import * as moment from "moment";
import { PostServiceProvider } from '../../providers/post-service/post-service';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  public token:string="";
  public nome:string="";
  public sobrenome:string="";
  public email:string="";
  public username:string="";
  public id:number;
  public fotoUrl:any;
  carregando:any;
  public post:Post;
  public posts: Post[];
  public postsUsuario:Post[]=[];
  public numeroPius:number;
  

  public fotoUsuario = document.querySelector('.fotoUsuario');
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private _usuarioService:UsuariosServiceProvider,
     public loadingCtrl:LoadingController,
     private _http: HttpClient,
     private _postService:PostServiceProvider,
     
     )
     
     
    {
      var nome="";
      var sobrenome="";
      var email=""; 
      var id="";
      this.token=_usuarioService.token;
      this.username=JWT(this.token)['username'];
      _usuarioService.procuraUsuario(this.username)
       .then((result)=>{
        this.nome=result["first_name"];
        this.sobrenome=result["last_name"];
        this.email=result["email"];
        this.id=result["id"];
      console.log("encontrei o username",id,result["id"]);
  }
)
    }
    ionViewWillEnter() {
      console.log("Estou no ionViewWillEnter");
      this.carregando = this.loadingCtrl.create({
        content: 'Preparando tudo...'
      });
      this.carregando.present();
  
      this.obtemPiusUsuario(this.username)
      .then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
      },5000);});
      
        };


    obtemPiusUsuario(username){
      
      return new Promise((resolve,reject)=>{
      this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
      .subscribe(
        (posts) =>{
          moment.locale('pt-BR');
          // Trata cada piu e adiciona informação do username e tempo relativo
          posts.forEach(post=>{
            console.log(post,"bora",post.usuario,this._usuarioService.id);
            if (post.usuario==this._usuarioService.id){
              this.postsUsuario.push(post);
              console.log("Coloquei o post do", username,post);
            }
          });
          
          this.postsUsuario.forEach(post =>{
          
            // Para usar o .then a função adicionaAutor no serviço tinha que ser um Promise
            this._postService.adicionaAutor(post)
            .then(
              ()=>{
                console.log("ESTOU AQUI");
                posts.forEach(post=>{
                              
                this.posts = this.postsUsuario;
                console.log("11111",this.posts);
                post.tempoRelativo=moment(post.data).fromNow();
                this.posts.sort(function(a,b){
                  return (new Date(a.data).getTime())-(new Date(b.data).getTime())
                });
                console.log("EM ORDEM", posts);
                this.numeroPius=this.posts.length;
                this.posts=this.posts.reverse();
              })});
          });
          console.log("Pius completos");
          resolve(this.postsUsuario);
        },erro=>{
          reject(erro);
        }
      );
      })            
      }}


    