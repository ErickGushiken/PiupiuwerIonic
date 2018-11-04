import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import {CadastroPage } from '../cadastro/cadastro';
import { UsuariosServiceProvider } from '../../providers/usuarios-service/usuarios-service';
import { PostServiceProvider } from '../../providers/post-service/post-service';
import { DocumentacaoPage } from '../documentacao/documentacao';


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
  public username:string="";
  public password:string="";
  public name:string="";
  public carregando: any;
  public foto = document.querySelector('.fotoUsuario');
  public mensagem:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast:ToastController,
    private _alertCtrl:AlertController,
    private _usuariosService:UsuariosServiceProvider,
    public loadingCtrl:LoadingController,
    private _postService:PostServiceProvider,
    private menuCtrl:MenuController,
    
    ) {
    this.username=_usuariosService.usuario;
    this.password=_usuariosService.senha;
    this.menuCtrl.enable(false,"meuMenu");
    }

    ionViewWillLeave(){
      this.menuCtrl.enable(true,"meuMenu");
    }


    efetuaLogin(){
      this.carregandoAnimaçao();    
      this._usuariosService
      .efetuaLogin(this.username,this.password)
      .then((resposta)=>{
        this.carregando.dismiss();
        this.navCtrl.setRoot(HomePage);
        this.mensagem=this.toast.create({
          message: 'Login bem sucedido',
          duration: 3000,
        });
        this.mensagem.present();
      },
      (erro)=>{
        this.carregando.dismiss();
        this._alertCtrl.create({
          title:"Ocorreu um problema",
          subTitle:"Verifique os dados e tente novamente",
          buttons:[{text:"ok"}]
        }).present();
      })
    }

    irParaDocumentacao(){
      this.navCtrl.push(DocumentacaoPage);
    }
    irParaPagina(){
      this.navCtrl.push(CadastroPage);
    }
    carregandoAnimaçao(){
      this.carregando=this.loadingCtrl.create({
        content:'Autenticando...'
      });
      this.carregando.present();
    }
  }
