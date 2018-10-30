
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UsuariosServiceProvider } from '../usuarios-service/usuarios-service';
// import { Headers } from '@angular/http'




@Injectable()

export class CriarPostServiceProvider {
  
  private headers: HttpHeaders;


  constructor(private _http: HttpClient,
    public usuarioService:UsuariosServiceProvider
    
    ) {
            // Criar as variaveis para autenticação
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'JWT '+this.usuarioService.token,
      });
      
    
  }

  criaPost(conteudo){
    console.log("entrei na criaPost");
    return new Promise((resolve,reject)=>{



      // no post ->{headers:headers}
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
}}


// RECUPERAÇÂO DA VERSÂO FUNCIONAL
// this._http.post('http://piupiuwer.polijunior.com.br/api/pius/',conteudo)
// .subscribe(resposta=>{
//   resolve(resposta);
// }, (erro)=>{
//   reject(erro);
// });
