import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CadastroServiceProvider } from '../../providers/cadastro-service/cadastro-service';
import { Usuario } from '../../modelos/usuario';
import { HomePage } from '../home/home';
import { FormBuilder,FormGroup, Validators, FormControl } from '@angular/forms';
import { UsernameValidador } from '../../validators/username';

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
  public password2:string ="";
  formulario: any;
  tentativaCadastro: boolean=false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder:FormBuilder,
    private _alertCtrl:AlertController,
    private _cadastroService:CadastroServiceProvider) {

    this.formulario =   this.formBuilder.group({
      
      
      
      // password2:['',Validators.compose([Validators.required])],
      
      
      email: new FormControl(''),
      last_name: new FormControl(''),
      first_name: new FormControl(''),
      password:['',Validators.compose([Validators.required])],
      username: new FormControl('',Validators.compose([Validators.maxLength(140),Validators.pattern('[a-zA-Z0-9@,+-_ ]*'),Validators.required])),
    })    

      
  }

  
  efetuaCadastro(){
    

    console.log('OLAE',this.nome);
    console.log("hello",this.formulario);
    console.log(this.sobrenome);
    console.log(this.username);
    console.log(this.email);
    console.log(this.password);
// .efetuaCadastro(this.username, this.password,this.nome,this.sobrenome,this.email)
    this._cadastroService
    .efetuaCadastro(this.formulario)
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
