import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { Usuario } from '../../modelos/usuario';
import { CadastroPage } from '../cadastro/cadastro';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string="Erick_Gushiken";
  password:string="vempoli@852";
  name:string="";
  carregando: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl:AlertController,
    private _usuariosService:UsuariosServiceProvider,
    public loadingCtrl:LoadingController,
    
    ) {

    }

  efetuaLogin(){
    this.carregandoAnimaçao();
    console.log(this.username);
    console.log(this.password);
    
    this._usuariosService
    .efetuaLogin(this.username,this.password)
    .then((resposta)=>{
      console.log(resposta);
      this.carregando.dismiss();
      this.navCtrl.setRoot(HomePage);
    },
    (erro)=>{
      console.log(erro);
      this.carregando.dismiss();
      this._alertCtrl.create({
        title:"Ocorreu um problema",
        subTitle:"Verifique os dados e tente novamente",
        buttons:[{text:"ok"}]
      }).present();
    })
    // PROPOSTA ANTIGA
    // .subscribe(
    //    (usuario:Usuario)=>{
    //      console.log(usuario);
    //   this.navCtrl.setRoot(HomePage);
    // },
    // () =>{
    //   this._alertCtrl.create({
    //     title: "Falha no Login",
    //     subTitle: "ERROU",
    //     buttons:[
    //       {text:"ok"}
    //     ]
    //   }).present();
       
    // }
    // )  
  }

  irParaPagina(){
    this.navCtrl.setRoot(CadastroPage);
  }

  carregandoAnimaçao(){
    this.carregando=this.loadingCtrl.create({
      content:'Autenticando...'
    });
    this.carregando.present();
  }
}
