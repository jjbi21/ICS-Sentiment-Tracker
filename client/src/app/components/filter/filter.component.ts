import { Component, OnInit } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';
import inf133data from '../../../assets/inf33sentiment.json';
import cs143adata from '../../../assets/cs143asentiment.json';
import { SentimentData } from '../../data/sentiment-data';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  timeFilterCategory:string = 'Past day';
  timeFilterCategories:string[] = ["Past day", "Past week", "Past month", "Past year", "All time"];
  classCategory:string = "Select class";
  classCategories: string[] = ["INF 133", "CS 143A"];
  result_list: SentimentData[];


  constructor(private service:SentimentService) { }

  ngOnInit() {
  }

  filter()
  {
    let result = [];
    let data = inf133data;
    if (this.classCategory === 'INF 133')
      data = inf133data;
    else if (this.classCategory === 'CS 143A')
      data = cs143adata;

   
    let today = new Date();
    switch (this.timeFilterCategory)
    {
      case "Past day":
        for (let message of data)
        {
          if (Math.abs(today.getTime() - new Date(message['timestamp']).getTime()) / 36e5 < 24)
            result.push(new SentimentData(message));
        }
        break;
      case "Past week":
        for (let message of data)
        {
          if (Math.abs(today.getTime() - new Date(message['timestamp']).getTime()) / (24 * 60 * 60 * 1000) < 7)
            result.push(new SentimentData(message));
        }
        break;
      case "Past month":
        for (let message of data)
        {
          if (today.getMonth() == new Date(message['timestamp']).getMonth())
            result.push(new SentimentData(message));
        }
        break;
      case "Past year":
        for (let message of data)
        {
          if (Math.abs(today.getTime() - new Date(message['timestamp']).getTime()) / (24 * 60 * 60 * 1000) < 365)
            result.push(new SentimentData(message));
        }
        break;
      default:
        data.forEach(x => result.push(new SentimentData(x)));
        break;
      }
      this.result_list = result;
      console.log(this.result_list);
      console.log(new Date(this.result_list[0].timestamp).getTime());
  }

}
