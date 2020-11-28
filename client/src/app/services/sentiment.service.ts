import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SentimentData } from '../data/sentiment-data';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    return Promise.resolve(this.http.get(this.expressBaseUrl+endpoint).toPromise());
  }

  // specify the course
  getMessageData(courseName:string):Promise<SentimentData[]> {
      console.log(window.location.pathname);
      
    return Promise.resolve(this.http.get('./assets/inf133sentiment.json').toPromise()).then((data) => {
        console.log(data);
        return null;
        // return data.map ( (message) => {
        //     return new SentimentData(message);
        // });
    });
  }
}
