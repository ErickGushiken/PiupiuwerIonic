import { Component } from '@angular/core';
import { NavController, AlertController, Alert, LoadingController, Refresher, ActionSheetController, ToastController } from 'ionic-angular';
import * as moment from "moment";
import { HttpClient} from '@angular/common/http';
import { Post } from '../../modelos/post';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { FriendPage } from '../friend/friend';
import { DocumentacaoPage } from '../documentacao/documentacao';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public conteudoPost:string="";
  public carregando: any;
  public mensagem:any;
  public email:string="";
  public post:Post;
  public posts: Post[];
  public postDateOrder:Post[];
  public novoPostInput = document.querySelector('.formPostInput');

  constructor(public navCtrl: NavController,
    private toast:ToastController,
    public loadingCtrl:LoadingController,
    private _alertCtrl:AlertController,
    private _http: HttpClient,
    private socialSharing: SocialSharing,
    private _postService:PostServiceProvider,
    private _usuarioService:UsuariosServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    ) 
    {}

    obtemPius(){
      return new Promise((resolve,reject)=>{
      this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
      .subscribe((posts) =>{
        moment.locale('pt-BR');
        
        // Adiciona tempo relativo
        posts.forEach(post =>{
          post.tempoRelativo=moment(post.data).fromNow();
    
          // Adiciona autor de cada post
          this._postService.adicionaAutor(post)
          .then(()=>{
            this.posts = posts;
            this.posts.sort(function(a,b){
              return (new Date(a.data).getTime())-(new Date(b.data).getTime())
            });
            this.posts=this.posts.reverse();
          });
        });
        resolve(posts);
      },erro=>{
        reject(erro);
      });
    })
  }
  // Primeira função a ser executada
  ionViewWillEnter(){   
    this.carregando = this.loadingCtrl.create({
      content: 'Preparando tudo...'
    });
    this.carregando.present();
    this.obtemPius()
    .then(()=>{setTimeout(()=>{
      this.carregando.dismiss();
    },5000);
    });
  }
  
  doRefresh(refresher){
  this.obtemPius()
  .then(()=>{
    refresher.complete();
  })
  } 
  // Função para ir na página do amiguinho
  selecionaUsuario(post: Post){
    this.navCtrl.push(FriendPage,{usuarioUsername:post.autor});
  }

  irParaDocumentacao(){
    this.navCtrl.push(DocumentacaoPage);
  }

  // Função para compartilhar no whats
  compartilhaWhats(post:Post){
    var msg = post.conteudo;
    this.socialSharing.shareViaWhatsApp(msg,null,null);
  }

  // FAVORITAR POST
  favoritar(post:Post){
    this._postService.favoritaPost(post)
    .then(()=>{
      this.carregando = this.loadingCtrl.create({
        content: 'Atualizando posts...'
      });
      this.carregando.present();
      this.obtemPius()
      .then(()=>{
        setTimeout(()=>{
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
    });
  }


  // Função para deletar Post
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
      this.obtemPius()
      .then(()=>{
        setTimeout(()=>{
        this.carregando.dismiss();
        this.mensagem=this.toast.create({
          message: 'Deletada com sucesso',
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

  // Função para contar palavras
  contagemInput(conteudo){
    var contador = document.querySelector('.contador');
    var limite = document.querySelector('.limiteExcedido');
    var novoPostCard = document.querySelector('.formCard');
    var num_palavras = conteudo.length;
    contador.innerHTML="<p>"+num_palavras+" /140 caracteres </p>";
    // Altera os estilos / aviso conforme o contador
    if(num_palavras==140){
      novoPostCard.classList.add("bordaAzul");
      limite.innerHTML="<p></p>";
      contador.classList.remove("limite");
    }else if(num_palavras>140){
      novoPostCard.classList.remove("bordaAzul");
      novoPostCard.classList.add("bordaVermelha");
      limite.innerHTML="<p>Ultrapassou o limite</p>";
      contador.classList.add('limite');
      limite.classList.add("limite");

    }else if(num_palavras==0){
      contador.innerHTML="<p></p>";
      limite.innerHTML="<p></p>";
      contador.classList.remove("limite");
      novoPostCard.classList.remove("bordaAzul");
      novoPostCard.classList.remove("bordaVermelha");
      contador.classList.remove("limite");
    }
    else{
      novoPostCard.classList.remove("bordaAzul");
      novoPostCard.classList.remove("bordaVermelha");
      contador.classList.remove("limite");
    }
  }

  // Função para criar um post
  criaPost(){
    var novoPostCard = document.querySelector('.formCard');
    var contador = document.querySelector('.contador');
    let post={
      conteudo:this.conteudoPost,
      usuario:this._usuarioService.id,
    };
    if(post.conteudo.length>140 || post.conteudo.length==0){
      this._alertCtrl.create({
        title:"Ocorreu um problema",
        subTitle:"Verifique sua mensagem",
        buttons:[{text:"ok"}]
      }).present();
    }else{
      this._postService.criaPost(post)
      .then(()=>{
        // No caso de sucesso
        // Limpar os campos do input
        this.conteudoPost="";
        contador.innerHTML="<p></p>";
        novoPostCard.classList.remove("bordaAzul");
        novoPostCard.classList.remove("bordaVermelha");
        this.carregando = this.loadingCtrl.create({
          content: 'Atualizando posts...'
        });
        this.carregando.present();
        this.obtemPius()
        .then(()=>{
          setTimeout(()=>{
            this.carregando.dismiss();
          },5000);
        });
      },()=>{
        // No caso de erro
        this._alertCtrl.create({
          title:"Ocorreu um problema",
          subTitle:"Verifique sua conexão com a internet",
          buttons:[{text:"ok"}]
        }).present();
      });
    }
  }
  carregandoAnimaçao(){
    this.carregando=this.loadingCtrl.create({
      content:'Estamos preparando tudo...'
    });
    this.carregando.present();
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



