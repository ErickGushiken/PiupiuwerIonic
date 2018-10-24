import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient} from '@angular/common/http';
import { Post } from '../../modelos/post';
import { UserPage } from '../user/user';
import { CadastroPage } from '../cadastro/cadastro';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AutorServiceProvider } from '../../providers/autor-service/autor-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  conteudoPost:string="";
  

  public posts:Post[];
  public post:Post;
 
  

  constructor(public navCtrl: NavController,
    private _http: HttpClient,
    private socialSharing: SocialSharing,
    private _autorService:AutorServiceProvider,) {
    this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
    .subscribe(
      (posts) =>{
        this.posts = posts;
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

    // Função para criar um post
    criaPost(){
      console.log("entrei na função criaPost dentro de home.ts")
      console.log(this.conteudoPost);
    }

    // Função para compartilhar no whats
    compartilhaWhats(post:Post){
      var msg = post.conteudo;
      this.socialSharing.shareViaWhatsApp(msg,null,null);
      console.log("compartilhei");
    }

    
  }

