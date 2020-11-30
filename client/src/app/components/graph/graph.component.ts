import { Component, OnInit, Input } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';
import demodata from '../../../assets/inf133sentiment.json';
import { SentimentData } from '../../data/sentiment-data';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
    @Input() result: SentimentData[];
    @Input() filter: string;

  constructor(private sentimentService: SentimentService) { }

  ngOnInit() {
    let data = this.parseJson();
    console.log(data);
    // this.sentimentService.getMessageData('').then(() => {
    //   console.log('d');
    // });
    }

    week() {
        var data_points = {};
        var mon = 0;
        var tues = 0;
        var wed = 0;
        var thur = 0;
        var fri = 0;
        var sat = 0;
        var sun = 0;
        for (var x = 0; x < this.result.length; x++) {
            
        }
    }

  // to be removed when implementing backend, serves just to mimic backend served data format
  parseJson() {
    return demodata.map ( (message) => {
            return new SentimentData(message);
    });
  }
}
