import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { Post } from '../../modelos/post';
import { HttpClient } from '@angular/common/http';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import * as JWT from 'jwt-decode';
import * as moment from "moment";
import { SocialSharing } from '@ionic-native/social-sharing';
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
  public postsFavoritados:Post[]=[];
  public postsNaoFavoritados:Post[]=[];
  public postsOrganizados:Post[]=[];
  public numeroPius:number;
  socialSharing: SocialSharing;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private _usuarioService:UsuariosServiceProvider,
     public loadingCtrl:LoadingController,
     private _http: HttpClient,
     private _postService:PostServiceProvider,
     private _alertCtrl:AlertController,
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
  this.postsFavoritados=[];
  this.postsNaoFavoritados=[];
  this.postsOrganizados=[];
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
            
            post.tempoRelativo=moment(post.data).fromNow();
            this.posts.sort(function(a,b){
              return (new Date(a.data).getTime())-(new Date(b.data).getTime())
            });
                        
            this.numeroPius=this.posts.length;
            
            

            // this.posts=this.posts.reverse();
            
          });

          
           
          
          
      });
      
        console.log("Separadeeenho", this.postsFavoritados,this.postsNaoFavoritados);

        console.log("5646516516515656IODSADIOAJDOASIJDASIODJASO");
      });
      console.log("TA FICANDO MT LOKO",this.postsUsuario);
          this.postsUsuario.forEach(post=>{
            if(post.favoritado){
              this.postsFavoritados.push(post);
            }else{
              this.postsNaoFavoritados.push(post);
            }
          

        });
      console.log("Pius completos");
      console.log(this.postsFavoritados,"SOU OS FAVORITADOS");
      console.log(this.postsNaoFavoritados,"SOU OS NAO FAVORITADOS");
      this.posts=[];
      this.postsFavoritados.reverse().forEach(post=>{
        this.postsOrganizados.push(post);
      });
      this.postsNaoFavoritados.reverse().forEach(post=>{
        this.postsOrganizados.push(post);
      })
      
      
      
      console.log(this.postsOrganizados,"SOLUÇÂO FINAL");
      
      resolve(this.postsUsuario);
    },erro=>{
      reject(erro);
    }
  );
  })            
  }
  favoritar(post:Post){
    
    this._postService.favoritaPost(post).then(
      
      ()=>{
    
      console.log("Favoritado");
      this.carregando = this.loadingCtrl.create({
        content: 'Atualizando posts...'
      });
      this.carregando.present();
      this.obtemPiusUsuario(this.username).then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
      },5000);});;
      // this._postService.obtemPius();

    },()=>{
      
    });
  }
// Função para compartilhar no whats
compartilhaWhats(post:Post){
  var msg = post.conteudo;
  this.socialSharing.shareViaWhatsApp(msg,null,null);
  console.log("compartilhei");
}





}
