import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { Post } from '../../modelos/post';
import { HttpClient } from '@angular/common/http';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import * as JWT from 'jwt-decode';
import * as moment from "moment";
/**
 * Generated class for the FriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  public id:number;
  public nome:string="";
  public sobrenome:string="";
  public email:string="";
  public username:string="";
  carregando:any;
  public post:Post;
  public posts: Post[]=[];
  public postsUsuario:Post[]=[];
  public numeroPius:number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private _usuarioService:UsuariosServiceProvider,
     public loadingCtrl:LoadingController,
     private _http: HttpClient,
     private _postService:PostServiceProvider,
     ){
      this.username=navParams.get("usuarioUsername");
      console.log(navParams.get("usuarioUsername"));

     }
     
     ionViewWillLoad(){
      
  
    console.log("PÁGINA DO MIGUINHO",this.username);
    this._usuarioService.procuraUsuario(this.username)
       .then((result)=>{
        this.nome=result["first_name"];
        this.sobrenome=result["last_name"];
        this.email=result["email"];
        this.id=result["id"];
        console.log("daskljkdsankdjasndaskjdbasj");
        console.log(this.username,this.nome,this.sobrenome);
    
        
  });
  
}

ionViewDidEnter() {
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

// Função para deletar Post
deletaPost(post:Post){
  console.log("Vou deletar / home.ts");
  this._postService.deletaPost(post).then(
    ()=>{
      // No caso de sucesso
      this.carregando = this.loadingCtrl.create({
        content: 'Atualizando posts...'
      });
      this.carregando.present();
      this.obtemPiusUsuario(this.username).then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
      },5000);});;
      console.log("ATUALIZANDO TUDO");

    },()=>{
      // No caso de erro
      console.log("deu ruim");
      
    }
  );
  
  
}
obtemPiusUsuario(username){
  this.posts=[];
  this.postsUsuario=[];
  var mensagemNPius = document.querySelector('.mensagemNPius');
  return new Promise((resolve,reject)=>{
  this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
  .subscribe(
    (posts) =>{
      moment.locale('pt-BR');
      // Trata cada piu e adiciona informação do username e tempo relativo
      posts.forEach(post=>{
        console.log(post,"bora",post.usuario,this._usuarioService.id);
        if (post.usuario==this.id){
          this.postsUsuario.push(post);
          console.log("Coloquei o post do", username,post);
        }
      });
      if (this.postsUsuario.length==0){
        console.log("sou otario e não postei pius");
      mensagemNPius.innerHTML="<p>Você ainda não possui pius.</p>";
    }
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
            console.log("fsd+6f5sd+6fds+6fs",this.posts.length);
            
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
  }






}
