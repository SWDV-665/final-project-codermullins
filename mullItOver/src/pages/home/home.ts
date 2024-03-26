import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Review List";

  reviews = [
    {
      img: "md-image",
      name: "McDonalds",
      thoughts: "food tastes like cardboard",
      rating: "star"
    },
    {
      img: "md-image",
      name: "Burger King",
      thoughts: "food has more flavor",
      rating: "star"
    },
    {
      img: "md-image",
      name: "Taco Bell",
      thoughts: "Cheap food that you can eat one handed",
      rating: "star"
    },
  ]

  constructor(public navCtrl: NavController) {

  }

}
