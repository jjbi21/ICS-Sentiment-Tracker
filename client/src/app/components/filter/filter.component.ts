import { Component, OnInit } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';
import inf133data from '../../../assets/inf133sentiment.json';
import cs143adata from '../../../assets/cs143asentiment.json';
import { SentimentData } from '../../data/sentiment-data';
import embed from 'vega-embed';

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
      console.log(this.service.date)
      this.service.getMessageData(this.service.course, this.service.date).then(response => {
          this.result_list = response;

          if (this.timeFilterCategory === 'Past year') {
              console.log(this.year());
              var year_values = this.year();

              var spec = {
                  "$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
                  "description": "A graph of the number of Tweets containing each type of activity.",
                  "data": {
                      "values": year_values
                  },
                  //TODO: Add mark and encoding
                  "mark": "bar",
                  "encoding": {
                      x: {
                          "field": "month",
                          "type": "nominal"
                      },
                      y: {
                          "aggregate": "count",
                          "type": "quantitative"

                      }
                  }
              };
              //var result = embed('#past_year_vis', spec);
          }
          
          if (this.timeFilterCategory === 'All time') {
              console.log(this.All_time());
          }
         
      });
      /*this.result_list = result;
      console.log(this.result_list);
      console.log(new Date(this.result_list[0].timestamp).getTime());*/
    }

    week() {
        var mon = 0;
        var mon_count = 0;
        var tues = 0;
        var tues_count = 0;
        var wed = 0;
        var wed_count = 0;
        var thur = 0;
        var thur_count = 0;
        var fri = 0;
        var fri_count = 0;
        var sat = 0;
        var sat_count = 0;
        var sun = 0;
        var sun_count = 0;
        for (var x = 0; x < this.result_list.length; x++) {
            if (this.result_list[x].timestamp.getDay() === 0) {
                sun += this.result_list[x].sentiment;
                sun_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 1) {
                mon += this.result_list[x].sentiment;
                mon_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 2) {
                tues += this.result_list[x].sentiment;
                tues_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 3) {
                wed += this.result_list[x].sentiment;
                wed_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 4) {
                thur += this.result_list[x].sentiment;
                thur_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 5) {
                fri += this.result_list[x].sentiment;
                fri_count++;
            }

            else if (this.result_list[x].timestamp.getDay() === 6) {
                sat += this.result_list[x].sentiment;
                sat_count++;
            }
        }

        var data_points = {
            'Mon': mon / mon_count, 'Tues': tues / tues_count, 'Wed': wed / wed_count, 'Thurs': thur / thur_count,
            'Fri': fri / fri_count, 'Sat': sat / sat_count, 'Sun': sun / sun_count
        };

        return data_points;
    }

    day() {
        var day_result = {};
        var final = {};
        for (var x = 0; x < this.result_list.length; x++) {
            if (!(this.result_list[x].timestamp.getHours() in day_result)) {
                day_result[this.result_list[x].timestamp.getHours()] = [this.result_list[x].sentiment, 1]
            }

            else if (this.result_list[x].timestamp.getHours() in day_result) {
                day_result[this.result_list[x].timestamp.getHours()][0] += this.result_list[x].sentiment;
                day_result[this.result_list[x].timestamp.getHours()][1]++;
            }
        }

        for (var hour in day_result) {
            final[hour] = day_result[hour][0] / day_result[hour][1]
        }

        return final;
    }

    year() {
        var year_result = {};
        var final = {};
        var year_key = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' };
        for (var x = 0; x < this.result_list.length; x++) {
            var data_date = new Date(this.result_list[x].timestamp)
            if (!(data_date.getMonth() in year_result)) {
                year_result[data_date.getMonth()] = [this.result_list[x].sentiment, 1]
            }

            else if (data_date.getMonth() in year_result) {
                year_result[data_date.getMonth()][0] += this.result_list[x].sentiment;
                year_result[data_date.getMonth()][1]++;
            }
        }

        const sorted_months = this.sortObj(year_result);

        for (var month in sorted_months) {
            final[year_key[month]] = sorted_months[month][0] / sorted_months[month][1]
        }

        
        return final;
    }

    All_time() {
        var year_result = {};
        var final = {};
        for (var x = 0; x < this.result_list.length; x++) {
            var data_date = new Date(this.result_list[x].timestamp)
            if (!(data_date.getFullYear() in year_result)) {
                year_result[data_date.getFullYear()] = [this.result_list[x].sentiment, 1]
            }

            else if (data_date.getFullYear() in year_result) {
                year_result[data_date.getFullYear()][0] += this.result_list[x].sentiment;
                year_result[data_date.getFullYear()][1]++;
            }
        }

        const sorted_years = this.sortObj(year_result);

        for (var year in sorted_years) {
            final[year] = sorted_years[year][0] / sorted_years[year][1]
        }

        return final;
    }

    sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

    // to be removed when implementing backend, serves just to mimic backend served data format
    //parseJson() {
    //  return demodata.map ( (message) => {
    //          return new SentimentData(message);
    //  });
    // }
}


