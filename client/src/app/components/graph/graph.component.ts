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
    @Input() time_filter: string;

  constructor(private sentimentService: SentimentService) { }

    ngOnInit() {
        if (this.time_filter === 'Past week') {
            console.log(this.week());
        }
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
        for (var x = 0; x < this.result.length; x++) {
            if (this.result[x].timestamp.getDay() === 0) {
                sun += this.result[x].sentiment;
                sun_count++;
            }

            else if (this.result[x].timestamp.getDay() === 1) {
                mon += this.result[x].sentiment;
                mon_count++;
            }

            else if (this.result[x].timestamp.getDay() === 2) {
                tues += this.result[x].sentiment;
                tues_count++;
            }

            else if (this.result[x].timestamp.getDay() === 3) {
                wed += this.result[x].sentiment;
                wed_count++;
            }

            else if (this.result[x].timestamp.getDay() === 4) {
                thur += this.result[x].sentiment;
                thur_count++;
            }

            else if (this.result[x].timestamp.getDay() === 5) {
                fri += this.result[x].sentiment;
                fri_count++;
            }

            else if (this.result[x].timestamp.getDay() === 6) {
                sat += this.result[x].sentiment;
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
        var final = {}
        for (var x = 0; x < this.result.length; x++) {
            if (!(this.result[x].timestamp.getHours() in day_result)) {
                day_result[this.result[x].timestamp.getHours()] = [this.result[x].sentiment, 1]
            }

            else if (this.result[x].timestamp.getHours() in day_result) {
                day_result[this.result[x].timestamp.getHours()][0] += this.result[x].sentiment;
                day_result[this.result[x].timestamp.getHours()][1]++;
            }
        }

        for (var hour in day_result) {
            final[hour] = day_result[hour][0]/day_result[hour][1]
        }

        return final;
    }

    year() {

    }

  // to be removed when implementing backend, serves just to mimic backend served data format
  //parseJson() {
  //  return demodata.map ( (message) => {
  //          return new SentimentData(message);
  //  });
 // }
}
