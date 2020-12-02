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
    @Input() result_list: SentimentData[];
    @Input() time_filter: string;

  constructor(private sentimentService: SentimentService) { }

  ngOnInit() {
      console.log(this.time_filter);
      console.log(this.sentimentService.date);
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
            final[hour] = day_result[hour][0]/day_result[hour][1]
        }

        return final;
    }

    year() {
        var year_result = {};
        var final = {};
        var year_key = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' };
        for (var x = 0; x < this.result_list.length; x++) {
            if (!(this.result_list[x].timestamp.getMonth() in year_result)) {
               year_result[this.result_list[x].timestamp.getMonth()] = [this.result_list[x].sentiment, 1]
            }

            else if (this.result_list[x].timestamp.getMonth() in year_result) {
                year_result[this.result_list[x].timestamp.getMonth()][0] += this.result_list[x].sentiment;
                year_result[this.result_list[x].timestamp.getMonth()][1]++;
            }
        }

        for (var month in year_result) {
            final[year_key[month]] = year_result[month][0] / year_result[month][1]
        }

        return final;
        }

    All_time() {
        var year_result = {};
        var final = {};
        for (var x = 0; x < this.result_list.length; x++) {
            if (!(this.result_list[x].timestamp.getFullYear() in year_result)) {
                year_result[this.result_list[x].timestamp.getFullYear()] = [this.result_list[x].sentiment, 1]
            }

            else if (this.result_list[x].timestamp.getFullYear() in year_result) {
                year_result[this.result_list[x].timestamp.getFullYear()][0] += this.result_list[x].sentiment;
                year_result[this.result_list[x].timestamp.getFullYear()][1]++;
            }
        }

        for (var year in year_result) {
            final[year] = year_result[year][0] / year_result[year][1]
        }

        return final;
    }

  // to be removed when implementing backend, serves just to mimic backend served data format
  //parseJson() {
  //  return demodata.map ( (message) => {
  //          return new SentimentData(message);
  //  });
 // }
}
