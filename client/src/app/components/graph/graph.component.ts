import { Component, OnInit } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';
import demodata from '../../../assets/inf33sentiment.json';
import { SentimentData } from '../../data/sentiment-data';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor(private sentimentService: SentimentService) { }

  ngOnInit() {
    let data = this.parseJson();
    console.log(data);
    // this.sentimentService.getMessageData('').then(() => {
    //   console.log('d');
    // });
  }

  // to be removed when implementing backend, serves just to mimic backend served data format
  parseJson() {
    return demodata.map ( (message) => {
            return new SentimentData(message);
    });
  }
}
