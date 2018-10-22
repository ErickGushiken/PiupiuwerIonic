import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CriarPostServiceProvider {

  constructor(public http: HttpClient) {

    
  }
    criaPost(){
      console.log("estou no provider criando um post")
    }

}
