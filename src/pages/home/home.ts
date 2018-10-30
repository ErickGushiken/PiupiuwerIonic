import { Component } from '@angular/core';
import { NavController, AlertController, Alert } from 'ionic-angular';

import { HttpClient} from '@angular/common/http';
import { Post } from '../../modelos/post';
import { UserPage } from '../user/user';
import { CadastroPage } from '../cadastro/cadastro';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AutorServiceProvider } from '../../providers/autor-service/autor-service';
import { CriarPostServiceProvider } from '../../providers/criar-post-service/criar-post-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  conteudoPost:string="";
  

  public posts:Post[];
  public post:Post;
  public postDateOrder:Post[];
  public contador = document.querySelector('.contador');
  public novoPostInput = document.querySelector('.formPostInput');
  private _alerta:Alert;

  constructor(public navCtrl: NavController,
    private _alertCtrl:AlertController,
    private _http: HttpClient,
    private socialSharing: SocialSharing,
    private _criarPostService:CriarPostServiceProvider, 
    // private _autorService:AutorServiceProvider,
    ) {
      this.ObtemPius();
    }
    ObtemPius(){
    this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
    .subscribe(
      (posts) =>{
        this.posts = posts;
        console.log("ola",this.posts);
        posts.sort((d1,d2)=> new Date(d2.data).getTime()-new Date(d1.data).getTime());
        console.log("kkk",posts)
        // this.posts.forEach(post => {
        //   post.procuraAutor();
        // });
      }
    );
    

    }
    //Função para selecionar o piu
    selecionaPost(post: Post){
      console.log("OLA");
      console.log(post.conteudo);
      this.navCtrl.push(UserPage);

    }

    selecionaUsuario(post: Post){
      console.log(post.usuario);
      console.log("fechou");
      this.navCtrl.push(UserPage);
      // this._autorService
    }

    irParaTeste(){
      this.navCtrl.push(CadastroPage);
    }

    // Função para compartilhar no whats
    compartilhaWhats(post:Post){
      var msg = post.conteudo;
      this.socialSharing.shareViaWhatsApp(msg,null,null);
      console.log("compartilhei");
    }

    // Função para contar palavras
    
    // Função para criar um post
    criaPost(){
      this._alertCtrl.create({
        title: 'Aviso',
        buttons:[
          {text:'ok'}
        ]});
      console.log("entrei na função criaPost dentro de home.ts")
      console.log(this.conteudoPost);
      let post={
        conteudo:this.conteudoPost,
        usuario:13,
      }

      this._criarPostService.criaPost(post).then(
        
        ()=>{
        // No caso de sucesso
        // Limpar os campos do input
        this.conteudoPost="";
        console.log("CRIADO");
      },()=>{
        // No caso de erro
        console.log("deu ruim");
      });
    


      // MODELO ANTIGO
      // .subscribe(
      //   ()=>{
      //     console.log("funcionou");
      //     // this._alerta.setSubTitle("Post criado com sucesso");
      //     // this._alerta.present();
      //   },
      //   ()=>{
      //     console.log("deu erro");
      //     console.log(post);
      //     // this._alerta.setSubTitle("Ocorreu um erro");
      //     // this._alerta.present();
      //   }
      // )

    }
    
  }

