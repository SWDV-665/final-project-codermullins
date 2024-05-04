import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable, throwError, tap, catchError } from "rxjs";

@Injectable()
export class ReviewServiceProvider {

    reviews: any = [];
    users: any = [];

    dataChanged$: Observable<boolean>;

    private dataChangedSubject: Subject<boolean>;

    //TODO change to heroku link
    baseURL = "http://localhost:8080";

    constructor(public http: HttpClient) {
        console.log('This is the Review Provider');

        this.dataChangedSubject = new Subject<boolean>();
        this.dataChanged$ = this.dataChangedSubject.asObservable();
    }

    //function to get all reviews in the list
    getReviews(): Observable<object[]> {
        return this.http.get<object[]>(this.baseURL + '/api/reviews').pipe(
            tap((_) => this.extractData),
            catchError(this.handleError)
        );
    }

    //extracts the Data from the database to use in functions
    private extractData(res: Response) {
        let body = res;
        return body || [];
    }

    //function to handle errors that may occur
    private handleError(error: Response | any) {

        let e = JSON.stringify(error, null, 2);
        console.log("Errors: ", e);
    
        let errMsg: string;
        if (error instanceof Response) {
          const err = error || '';
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return throwError(() => errMsg);
    }

    //function to delete a specific review by id
    deleteReview(id) {
        console.log("Remove Review - id = ", id);
        this.http.delete(this.baseURL + "/api/reviews/" + id).subscribe(res => {
          this.reviews = res;
          this.dataChangedSubject.next(true);
        });
    }

    //function add a review to the list
    addReview(review) {
        this.http.post(this.baseURL + '/api/reviews/', review).subscribe((res)=> {
          this.reviews = res;
          this.dataChangedSubject.next(true);
        });
      }

      //function to edit a review
      editReview(review, index) {
        console.log("Edit Item = ", review);
        this.http.put(this.baseURL + '/api/reviews/' + review._id, review).subscribe((res) => {
          this.reviews = res;
          this.dataChangedSubject.next(true);
        });
      }

      addImages(review, index) {
        this.http.put(this.baseURL + '/api/reviews', review._id, review.image).subscribe((res) => {
          this.reviews.image = res;
          this.dataChangedSubject.next(true);
        })
      }
    //function add a user to the list
    addUser(user) {
      this.http.post(this.baseURL + '/api/users/', user).subscribe((res)=> {
        this.users = res;
        this.dataChangedSubject.next(true);
      });
    }


}