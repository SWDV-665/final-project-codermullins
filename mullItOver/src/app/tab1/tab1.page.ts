import { Component, Directive } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ReviewServiceProvider } from '../services/data-service-provider';
import { InputDialogServiceProvider } from '../services/input-service-provider';
import { Subscription } from 'rxjs';
import { Share } from '@capacitor/share';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  title = "Review List";

  reviews: any[];
  errorMessage: string;
  dataChangedSubscription: Subscription;

  constructor(private router: Router, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: ReviewServiceProvider, public inputService: InputDialogServiceProvider, public platform: Platform, public photoService: PhotoService) {
    this.dataChangedSubscription = dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadReviews();
      this.photoService.loadSaved();
    })
  }

  // load reviews on page load
  ionViewDidEnter() {
    this.loadReviews();

  }

  ionViewDidLeave() {
    if(this.dataChangedSubscription) {
      this.dataChangedSubscription.unsubscribe();
    }
  }

  //call getReviews from the Data service provider
  loadReviews() {
    this.dataService.getReviews().subscribe(reviews => this.reviews = reviews,
      error => this.errorMessage =<any>error);
  }

  //call deleteReviews from the Data service provider
  deleteReview(id) {
    this.dataService.deleteReview(id);
  }

  // call prompt to add review from input service provider
  addReview() {
    console.log('Add new Item');
    this.inputService.showPrompt();
  }

  // call editReviews from the Data service provider
  async editReview(review, index) {
    console.log("Editing review - ", review, index);
    const toast = await this.toastCtrl.create({
      message: "Editing Review - " + review.name + "...",
      duration: 3000
    });
    toast.present();
    //calls prompt with params to prefill inputs
    this.inputService.showPrompt(review, index);
  }

  //function for the native sharing feature
  async shareReview(review, index) {
    console.log("Sharing Review For - ", review, index);
    const toast = await this.toastCtrl.create({
      message: "Sharing Review - " + review + "...",
      duration: 3000
    });
    toast.present();

    const options = {
      text: "Review For " + review.name + "/n" + review.thoughts,
      subject: "Shared from Mull It Over App"
    }

    await Share.share(options).then(() => {
      console.log("Review was Shared!!!!");
    }).catch((error) => {
      console.log("Error Sharing ", error);
    })
  }


}
