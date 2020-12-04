import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SentimentData } from '../data/sentiment-data';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
    expressBaseUrl:string = 'http://localhost:8888';
    course:string = null;
    date:Date = null;

    constructor(private http:HttpClient) { }

    // returns a promise to resolve an http get request
    private sendRequestToExpress(endpoint:string):Promise<any> {
        return Promise.resolve(this.http.get(this.expressBaseUrl+endpoint).toPromise());
    }

    // gets array of sentiment data to send to graph, applies filters on course and timestamp
    getMessageData(courseName:string, timestamp:Date):Promise<SentimentData[]> {
        // timestamp should be a date object, processing is done here
        return this.sendRequestToExpress('/api/messages/' + encodeURIComponent(courseName) + '/' + encodeURIComponent(timestamp.toISOString().replace('.', ','))).then((data) => {
            if (data === null) {
                return [];
            }
            return Object.values(data).map((message) => {
                return new SentimentData(message);
                });
            });
        
    }

    // gets an array of courses
    getCourses():Promise<String[]> {
        return this.sendRequestToExpress('/api/courses').then((data) => {
            console.log(data);
            return data;
        });
    }
}
