import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewServiceProvider } from 'src/app/services/data-service-provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('form') form: NgForm;

  //determine which form to diplay on login screen
  submissionType: 'login' | 'join' = 'login';

  users: any[  ];

  constructor(public dataService: ReviewServiceProvider, public router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return;

    if (this.submissionType === 'login') {
      console.log("log in ", email, password)
      this.router.navigate(['/']);
    } else if (this.submissionType === 'join') {
      const { name, repassword } = this.form.value;
      if (!name || !repassword) return; 
        if(password != repassword) {
          console.log("Passwords do not match")
          return;
        }
        var user = {
          name: name,
          email: email,
          password: password
        }
        this.dataService.addUser(user);

      console.log("Joining ", name, email, password, repassword);
    }
  }

  //changes from login to join
  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join'
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login'
    }
  }

}
