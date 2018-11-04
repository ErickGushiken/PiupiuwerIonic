import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { Post } from '../../modelos/post';
import { HttpClient } from '@angular/common/http';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import * as moment from "moment";
import { SocialSharing } from '@ionic-native/social-sharing';

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
  public carregando:any;
  public mensagem:any;
  public post:Post;
  public posts: Post[]=[];
  public postsUsuario:Post[]=[];
  public postsFavoritados:Post[]=[];
  public postsNaoFavoritados:Post[]=[];
  public postsOrganizados:Post[]=[];
  public numeroPius:number;
  public socialSharing: SocialSharing;

  constructor(public navCtrl: NavController,
    private toast:ToastController,
    private _alertCtrl:AlertController,
    public navParams: NavParams,
    private _usuarioService:UsuariosServiceProvider,
    public loadingCtrl:LoadingController,
    private _http: HttpClient,
    private _postService:PostServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    )
    {
      this.username=navParams.get("usuarioUsername");
    }
     
    ionViewWillLoad(){
      this._usuarioService.procuraUsuario(this.username)
      .then((result)=>{
        this.nome=result["first_name"];
        this.sobrenome=result["last_name"];
        this.email=result["email"];
        this.id=result["id"];
      });
    }

    ionViewDidEnter(){
      this.carregando = this.loadingCtrl.create({
        content: 'Preparando tudo...'
      });
      this.carregando.present();
      this.obtemPiusUsuario(this.username)
      .then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
        },5000);
      });
    };

    // Função para deletar post
    deletaPost(post:Post){
      this._alertCtrl.create({
        title:"Confirmação",
        subTitle:"Tem certeza que deseja deletar ?",
        buttons:[{text:"Cancelar", role:'cancel'},
        {text:"sim",handler:()=>{
      this._postService.deletaPost(post)
      .then(()=>{
        // No caso de sucesso
        this.carregando = this.loadingCtrl.create({
          content: 'Atualizando posts...'
        });
        this.carregando.present();
        this.obtemPiusUsuario(this.username).then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
        this.mensagem=this.toast.create({
          message: 'Edição feita com sucesso',
          duration: 3000,
        });
        this.mensagem.present();
        },5000);
      });
    },()=>{
      // No caso de erro
    }
    )}}]
    }).present();}
    obtemPiusUsuario(username){
      this.posts=[];
      this.postsUsuario=[];
      this.postsFavoritados=[];
      this.postsNaoFavoritados=[];
      this.postsOrganizados=[];
      var mensagemNPius = document.querySelector('.mensagemNPius');
      return new Promise((resolve,reject)=>{
        this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
        .subscribe((posts) =>{
          moment.locale('pt-BR');

          // Seleciona os pius com base no id do usuario
          posts.forEach(post=>{
            if (post.usuario.id==this.id){
              this.postsUsuario.push(post);
            }
          });

          // Altera o HTML se não encontrar nenhum piu
          if (this.postsUsuario.length==0){
            mensagemNPius.innerHTML="<p>Você ainda não possui pius.</p>";
          }

          // Adiciona o autor e o tempo relativo para cada piu
          this.postsUsuario.forEach(post =>{
            this._postService.adicionaAutor(post)
            .then(()=>{
              posts.forEach(post=>{ 
              this.posts = this.postsUsuario;
              post.tempoRelativo=moment(post.data).fromNow();
              this.posts.sort(function(a,b){
                return (new Date(a.data).getTime())-(new Date(b.data).getTime())
              });  
              this.numeroPius=this.posts.length;
            });
          });
        });
        
        // Separa entre posts favoritados e não favoritados
        this.postsUsuario.forEach(post=>{
          if(post.favoritado){
            this.postsFavoritados.push(post);
          }else{
            this.postsNaoFavoritados.push(post);
          }
        });
        
        // Junta os arrays favoritados e não favoritados
        this.posts=[];
        this.postsFavoritados.reverse().forEach(post=>{
          this.postsOrganizados.push(post);
        });
        this.postsNaoFavoritados.reverse().forEach(post=>{
          this.postsOrganizados.push(post);
        });
        resolve(this.postsUsuario);
      },erro=>{
        reject(erro);
      });
    })            
  }

  favoritar(post:Post){
    this._postService.favoritaPost(post)
    .then(()=>{   
      this.carregando = this.loadingCtrl.create({
        content: 'Atualizando posts...'
      });
      this.carregando.present();
      this.obtemPiusUsuario(this.username)
      .then(()=>{
        setTimeout(()=>{
          this.carregando.dismiss();
          this.mensagem=this.toast.create({
            message: 'Edição feita com sucesso',
            duration: 3000,
          });
          this.mensagem.present();
        },5000)
      });
    },()=>{
    });
  }
  // Função para compartilhar no whats
  compartilhaWhats(post:Post){
    var msg = post.conteudo;
    this.socialSharing.shareViaWhatsApp(msg,null,null);
  }
  menuOpcoes(post:Post){
    const acao = this.actionSheetCtrl.create({
      title: 'Opções',
      buttons: [
        {
          text: 'Deletar',
          handler: () => {
            this.deletaPost(post);
          }
        },{
          text: 'Favoritar',
          handler: () => {
            this.favoritar(post);
          }
        },{
          text: 'WhatsApp',
          handler: () => {
            this.compartilhaWhats(post);
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    acao.present();
  }
}
