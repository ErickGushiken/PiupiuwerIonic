import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CadastroServiceProvider } from '../../providers/cadastro-service/cadastro-service';
import { Usuario } from '../../modelos/usuario';
import { HomePage } from '../home/home';

/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  public nome: string = '';
  public sobrenome: string = '';
  public username: string ="";
  public email: string = '';
  public password:string ="";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    // private usuarioNovo:Usuario,
    private _alertCtrl:AlertController,
    private _cadastroService:CadastroServiceProvider) {
  }

  
  efetuaCadastro(){
    console.log(this.nome);
    console.log(this.sobrenome);
    console.log(this.username);
    console.log(this.email);
    console.log(this.password);

    

    // this.usuarioNovo.username=this.username;
    // this.usuarioNovo.password=this.password;
    // this.usuarioNovo.first_name=this.nome;
    // this.usuarioNovo.last_name=this.sobrenome;
    // this.usuarioNovo.email=this.email;


    this._cadastroService
    .efetuaCadastro(this.username, this.password,this.nome,this.sobrenome,this.email)
    .subscribe(
      (usuario:Usuario)=>{
        console.log(usuario);
        // console.log("OLAMUNDO",this.usuarioNovo);
        this.navCtrl.setRoot(HomePage);
      },
      ()=>{
        this._alertCtrl.create({
          title: "Falha no cadatro",
          subTitle:"Username já existente",
          buttons:[
            {text:"ok"}
          ]
        }).present();
      }
    )

  }

}
