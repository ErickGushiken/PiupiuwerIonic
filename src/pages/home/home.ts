import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient} from '@angular/common/http';
import { Post } from '../../modelos/post';
import { UserPage } from '../user/user';
import { CadastroPage } from '../cadastro/cadastro';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  conteudoPost:string="Hello world";
  

  public posts:Post[];
  // horarioAtual=Date.now();
  horarioAtual=new Date();
  

  constructor(public navCtrl: NavController,
    private _http: HttpClient,
    private socialSharing: SocialSharing,) {
    this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
    .subscribe(
      (posts) =>{
        this.posts = posts;
      }
    );
    }
    //Função para selecionar o piu
    selecionaPost(post: Post){
      console.log("OLA");
      console.log("HorarioAtual",this.horarioAtual.toISOString());
      console.log("horario do post",post.data);
      console.log(post.conteudo);
      this.navCtrl.push(UserPage);

    }

    selecionaUsuario(post: Post){
      console.log(post.usuario);
      console.log("fechou");
      this.navCtrl.push(UserPage);
    }

    irParaTeste(){
      this.navCtrl.push(CadastroPage);
    }

    // Função para calcular o tempo relativo
    calculaTempoRelativo(post:Post){
      console.log("tempo relativo");
      console.log(post.data);
      console.log( Date.parse(this.horarioAtual.toISOString()));
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
    }


  }

