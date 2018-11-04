import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DocumentacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-documentacao',
  templateUrl: 'documentacao.html',
})
export class DocumentacaoPage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentacaoPage');
  }

}
