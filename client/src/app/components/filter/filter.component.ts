import { Component, OnInit } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';
import inf133data from '../../../assets/inf133sentiment.json';
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
  classCategory:string = null;
  classCategories: string[] = ["inf133", "cs143a"];
  result_list: SentimentData[];


  constructor(private service:SentimentService) { }

  ngOnInit() {
  }

  filter()
  {
    /*let result = [];
    let data = null;
    if (this.classCategory === 'INF 133')
      data = inf133data;
    else if (this.classCategory === 'CS 143A')
      data = cs143adata;*/
    this.service.course = this.classCategory;

   
    let today = new Date();
    switch (this.timeFilterCategory)
    {
      case "Past day":
        /*for (let message in data)
        {
          if (Math.abs(today.getTime() - new Date(data[message].timestamp).getTime()) / 36e5 < 24)
            result.push(new SentimentData(data[message]));
        }*/
        this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        break;
      case "Past week":
        /*for (let message in data)
        {
          if (Math.abs(today.getTime() - new Date(data[message].timestamp).getTime()) / (24 * 60 * 60 * 1000) < 7)
            result.push(new SentimentData(data[message]));
        }*/
        this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000 * 7));
        break;
      case "Past month":
        /*for (let message in data)
        {
          if (today.getMonth() == new Date(data[message].timestamp).getMonth())
            result.push(new SentimentData(data[message]));
        }*/
        this.service.date = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "Past year":
        /*for (let message in data)
        {
          if (Math.abs(today.getTime() - new Date(data[message].timestamp).getTime()) / (24 * 60 * 60 * 1000) < 365)
            result.push(new SentimentData(data[message]));
        }*/
        this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000 * 365));
        break;
      default:
        /*for (let message in data)
          result.push(new SentimentData(data[message]));*/
        this.service.date = new Date(0);
        break;
      }
      this.service.getMessageData(this.service.course, this.service.date).then(response => {
          this.result_list = response;
          console.log(this.result_list)
      });
      /*this.result_list = result;
      console.log(this.result_list);
      console.log(new Date(this.result_list[0].timestamp).getTime());*/
  }

}
