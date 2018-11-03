import { Component } from '@angular/core';
import { NavController, AlertController, Alert, LoadingController } from 'ionic-angular';
import * as moment from "moment";
import { HttpClient} from '@angular/common/http';
import { Post } from '../../modelos/post';
import { UserPage } from '../user/user';
import { CadastroPage } from '../cadastro/cadastro';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { FriendPage } from '../friend/friend';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  conteudoPost:string="";
  carregando: any;
  email:string="dnsaijkdnasidas";
  

  
  public post:Post;
  public posts: Post[];
  public postDateOrder:Post[];

  public novoPostInput = document.querySelector('.formPostInput');
  
  

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
    private _alertCtrl:AlertController,
    private _http: HttpClient,
    private socialSharing: SocialSharing,
    private _postService:PostServiceProvider,
    private _usuarioService:UsuariosServiceProvider,
    
    ) 
    
    {

      // this.carregandoAnimaçao();
      // // this._postService.obtemPius();
      // this.obtemPius();
      // console.log("SOU O CONTADOR",this.novoPostInput);
  
      // setTimeout(()=>{
      //   this.carregando.dismiss();
      // },1000);
      
      
    }

    

    obtemPius(){
      return new Promise((resolve,reject)=>{
      this._http.get<Post[]>('http://piupiuwer.polijunior.com.br/api/pius/')
      .subscribe(
        (posts) =>{
          moment.locale('pt-BR');
          // Trata cada piu e adiciona informação do username e tempo relativo
          posts.forEach(post =>{
            
            post.tempoRelativo=moment(post.data).fromNow();
            console.log("tempo em milisegundos", new Date(post.data).getTime());
            
            // Para usar o .then a função adicionaAutor no serviço tinha que ser um Promise
            this._postService.adicionaAutor(post)
            .then(
              ()=>{
                this.posts = posts;

                this.posts.sort(function(a,b){
                  return (new Date(a.data).getTime())-(new Date(b.data).getTime())
                });
                console.log("EM ORDEM", posts);
                this.posts=this.posts.reverse();
              });
            
            
          });
          console.log("Pius completos");
          // this.posts = posts.reverse();
          resolve(posts);
          
        },erro=>{
          reject(erro);
        }
      );
      })            
      }
    
    ionViewWillEnter() {
      console.log("Estou no ionViewWillEnter");
      this.carregando = this.loadingCtrl.create({
        content: 'Preparando tudo...'
      });
      this.carregando.present();
      
  
      this.obtemPius()
      .then(()=>{setTimeout(()=>{
        this.carregando.dismiss();
      },5000);});
      
        };

   
  
    
  



    //Função para selecionar o piu
    selecionaPost(post: Post){
      console.log("OLA");
      console.log(post.conteudo);
      this.navCtrl.push(UserPage);

    }

    selecionaUsuario(post: Post){

      console.log(post.autor);
      console.log("selecionei post");
      this.navCtrl.push(FriendPage,{usuarioUsername:post.autor});
      
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
          this.obtemPius().then(()=>{setTimeout(()=>{
            this.carregando.dismiss();
          },5000);});;
          console.log("ATUALIZANDO TUDO");
          // this._postService.obtemPius();
  
        },()=>{
          // No caso de erro
          console.log("deu ruim");
          
        }
      );
      
      
    }


    // Função para contar palavras
    contagemInput(conteudo){
      var contador = document.querySelector('.contador');
      var novoPostCard = document.querySelector('.formCard');
      var num_palavras = conteudo.length;
      contador.innerHTML="<p>"+num_palavras+" /140 caracteres </p>";
      // Altera os estilos / aviso conforme o contador
        if(num_palavras==140){
          novoPostCard.classList.add("bordaAzul");
        }else if(num_palavras>140){
          novoPostCard.classList.remove("bordaAzul");
          novoPostCard.classList.add("bordaVermelha");
        }else if(num_palavras==0){
          contador.innerHTML="<p></p>";
        }
        else{
          novoPostCard.classList.remove("bordaAzul");
          novoPostCard.classList.remove("bordaVermelha");
        }
  
  }
    
    // Função para criar um post
    criaPost(){
      var contador = document.querySelector('.contador');
      console.log("entrei na função criaPost dentro de home.ts")
      console.log(this.conteudoPost);
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
      this._postService.criaPost(post).then(
        
        ()=>{
        // No caso de sucesso
        // Limpar os campos do input
        this.conteudoPost="";
        contador.innerHTML="<p></p>";
        console.log("CRIADO");
        this.carregando = this.loadingCtrl.create({
          content: 'Atualizando posts...'
        });
        this.carregando.present();
        this.obtemPius().then(()=>{setTimeout(()=>{
          this.carregando.dismiss();
        },5000);});;
        // this._postService.obtemPius();

      },()=>{
        // No caso de erro
        console.log("deu ruim");
        this._alertCtrl.create({
          title:"Ocorreu um problema",
          subTitle:"Verifique sua conexão com a internet",
          buttons:[{text:"ok"}]
        }).present();
      });
    }

      
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
    carregandoAnimaçao(){
      this.carregando=this.loadingCtrl.create({
        content:'Estamos preparando tudo...'
      });
      this.carregando.present();
    }
  }

