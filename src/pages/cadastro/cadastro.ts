import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CadastroServiceProvider } from '../../providers/cadastro-service/cadastro-service';
import { FormBuilder,FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { HomePage } from '../home/home';
import { Usuario } from '../../modelos/usuario';
import { ValidationServiceProvider } from '../../validators/password';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
// NOVA IMPLEMENTAÇÂO
@ViewChild('signupSlider') 
signupSlider: any;
pagina1: FormGroup;
pagina2: FormGroup;
public mensagem:any;
envio: boolean = false;

  

constructor(public navCtrl: NavController,
  private toast:ToastController,
  
  public formBuilder: FormBuilder,
  private _cadastroService:CadastroServiceProvider,
  private _alertCtrl:AlertController
  ) {
  this.pagina1 = formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email:["", Validators.required],
});

this.pagina2 = formBuilder.group({
    username: ['', Validators.compose(
          [Validators.maxLength(140),
          Validators.pattern('[a-zA-Z0-9@,+-_ ]*'),
          Validators.required]
        )],
    password: ['', Validators.required],
    password2:["",Validators.required], 
},
{validator: ValidationServiceProvider.MatchPassword}
);

}

next(){
    this.signupSlider.slideNext();
}

prev(){
    this.signupSlider.slidePrev();
}

save(){

  this.envio = true;
 
  if(!this.pagina2.valid){
      
      console.log("ERRO");
      this.signupSlider.slideTo(0);
  }
  else {
    console.log("CHECK");
    this.efetuaCadastro();
   
  }
}








  efetuaCadastro(){
    // this.save();
    console.log("SOU OS DADOS", this.pagina2)

    this._cadastroService
    .efetuaCadastro(this.pagina1,this.pagina2)
    .subscribe(
      (usuario:Usuario)=>{
        this.navCtrl.setRoot(HomePage);
        this.mensagem=this.toast.create({
          message: 'Login bem sucedido',
          duration: 3000,
        });
        this.mensagem.present();
      },()=>{
        this._alertCtrl.create({
          title: "Falha no cadastro",
          subTitle:"Ocorreu um problema",
          buttons:[
            {text:"ok"}
          ]
        }).present();
      }
    )
  }
}
