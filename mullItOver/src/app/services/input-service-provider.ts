import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewServiceProvider } from './data-service-provider';
import { AlertController } from '@ionic/angular';
import { PhotoService } from './photo.service';

/*
  Generated class for the InputDialogServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InputDialogServiceProvider {

  constructor(public http: HttpClient, public dataService: ReviewServiceProvider, public alertCtrl: AlertController, public photoService: PhotoService) {
    console.log('Hello InputServiceProvider Provider');
  }

  async showPrompt(review?, index?) {
    const prompt = await this.alertCtrl.create({
      header: review ? "Edit Review" : "Add New Review",
      message: review ? "Edit review in the list" : "Please Add A New Review",
      inputs: [
        {
          name: "name",
          placeholder: 'Name',
          value: review ? review.name : null
        },
        {
          name: "thoughts",
          placeholder: 'Thoughts',
          value: review ? review.thoughts : null
        },
        {
          name: "rating",
          placeholder: 'Rating',
          value: review ? review.rating : null
        },
        {
            name: "image",
            placeholder: 'Add Image',
            value: review ? review.image : null,
          }
      ],
      buttons: [
        {
          text: "Add Image",
          handler: data => {
            this.photoService.addNewToGallery(review, index);
          }
        },

        {
          text: "Cancel",
          handler: data => {
            console.log("Canceled");
          }
        },
        {
          text: "Save",
          handler: review => {
            console.log("Saved clicked", review);
            if (index !== undefined) {
              this.dataService.editReview(review, index);
            }
            else {
              this.dataService.addReview(review);
            }
          }
        },
      ] 
    });
    await prompt.present();
  }

}