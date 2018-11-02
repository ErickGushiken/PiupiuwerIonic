
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
// PORQUE AO INICIAR A PAGINA A FUNÇÂO obtemPius PRECISA ESTAR NA HOME.ts ???
  // obtemPius(){

  //   this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
  //   .subscribe(
  //     (posts) =>{
  //       moment.locale('pt-BR');
  //       // Trata cada piu e adiciona informação do username e tempo relativo
  //       posts.forEach(post =>{
  //         console.log("olar");
  //         this.adicionaAutor(post);
  //         post.tempoRelativo=moment(post.data).fromNow();
  //         console.log(post.tempoRelativo);
  //       });
  //       this.posts = posts.reverse();
  //       console.log(posts);
        
  //     }
  //   );
                   
  //   }

  // obtemPius(){

  //   this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
  //   .subscribe(
  //     (posts) =>{
  //       this.posts = posts;
  //       moment.locale('pt-BR');
  //       // Função que adiciona informações relevantes para o card, como tempo relativo e nome de usuario
  //       this.posts.forEach(post => {
  //         this.adicionaAutor(post);
  //         console.log(post.autor);
  //         post.tempoRelativo=moment(post.data).fromNow();

  //       });
  //       console.log(posts);
        
  //     }
  //   );
                   
  //   }


  criaPost(conteudo){
    console.log("SOU O TOKEN ANTES DA REQUISIÇÂO",this.usuarioService.token);
    // Criar as variaveis para autenticação
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'JWT '+this.usuarioService.token,
    });


    console.log("entrei na criaPost");
    return new Promise((resolve,reject)=>{
      console.log('SOU O HEADER',this.headers);
      this._http.post('http://piupiuwer.polijunior.com.br/api/pius/',conteudo,{headers:this.headers})
      .subscribe(resposta=>{
        console.log(resposta);
        resolve(resposta);
      }, (erro)=>{
        console.log(erro);
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
          
          if(usuario.id==post.usuario){
            
            post.autor=usuario.username;
            console.log("Atribui o autor",post);
            return
          }
        });
        resolve(usuarios);
      },(erro)=>{
        reject(erro);
      }
    );
  }

)};

  deletaPost(post){
    
    if (post.autor==this.usuarioService.usuario){
      console.log("achei o dono do post",post.autor);
      console.log("POST ID",post.id);
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'JWT '+this.usuarioService.token,
      });
    }else{
      console.log("Você não pode deletar");
    
      

  }
  console.log("sou o header oksaoks,aosmao",this.headers);
      return new Promise((resolve,reject)=>{
      this._http.delete('http://piupiuwer.polijunior.com.br/api/pius/'+post.id,{headers:this.headers})
      .subscribe(
        (resposta)=>{
          // Zera o parametro
          this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':'JWT '+0,
          });
          console.log(resposta),
          console.log("Colocar um toast de sucesso");
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



// RECUPERAÇÂO DA VERSÂO FUNCIONAL
// this._http.post('http://piupiuwer.polijunior.com.br/api/pius/',conteudo)
// .subscribe(resposta=>{
//   resolve(resposta);
// }, (erro)=>{
//   reject(erro);
// });
}
