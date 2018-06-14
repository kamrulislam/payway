import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { HttpClient } from '@angular/common/http';

declare const payway: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  frame:any;
  amount: number;

  constructor(public navCtrl: NavController, private http: HttpClient) {}

  ionViewDidLoad() {
    const script = document.createElement("script");
    script.onload = () => {
      var createdCallback = (err, frame) => {
        console.log(err, frame);
        if (!err) {
          this.frame = frame;
        }
      };
      payway.createCreditCardFrame(
        {
          publishableApiKey: "T11287_PUB_hw6sp68b746v25y9eh6c8dxxtb744y5tm3fjbniqxxkwagppwqftn7zayb32",
          onValid: function() {
            console.log("valid");
          },
          onInvalid: function() {
            console.log("invalid");
          },
          tokenMode: "callback"
        },
        createdCallback
      );
    };
    script.src = "https://api.payway.com.au/rest/v1/payway.js";

    document.head.appendChild(script);
  }

  payNow(): void{
    this.frame.getToken((err, token) => {
      if(err) {
        return console.log(err);
      }
      // call api with token
      console.log(token.singleUseTokenId);
      this.http.post('http://localhost:3000/pay', {
        token: token.singleUseTokenId,
        amount: this.amount
      }).subscribe((result) => {
        console.log(result);
      });
    });
  }
}
