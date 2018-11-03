import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/login/login';
import { UsuariosServiceProvider } from '../providers/usuarios-service/usuarios-service';

@Component({
  // O selector encapsula as alterações do scss
  selector:'myApp',
  templateUrl: 'app.html'
})
export class MyApp {
  // Recuperar o elemento de navegação do template
  @ViewChild(Nav) public nav:Nav;
  rootPage:any = LoginPage;

  // Define as paginas que podem ser acessadas do menu
  public paginas = [
    {titulo : "Meu Perfil", componente: UserPage, icone:'person',},
    {titulo : "Sair", componente: LoginPage, icone:'log-out',}

  ];
  usuario: string;
  email: any;
  
  


  constructor(platform: Platform,
     statusBar: StatusBar,
      splashScreen: SplashScreen,
      private _usuarioService:UsuariosServiceProvider,
      public events:Events) {
        events.subscribe("usuario criado",(usuarioUsername, usuarioEmail)=>{
          this.usuario=usuarioUsername;
          this.email=usuarioEmail;
          console.log("Agora SIM",this.usuario,this.email);
        });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      console.log("f,dksafjaindasikdnask",this._usuarioService.email);
    });
    
    

  }

  ionViewWillLeave(){
    this.usuario=this._usuarioService.usuario;
    this.email=this._usuarioService.email;
    console.log("barra navegação", this.usuario)
  }

  irParaPagina(componente){
    
    if(componente=="LoginPage"){
      this.nav.setRoot(componente);
    }else{
    this.nav.push(componente);
    }
  }
}

