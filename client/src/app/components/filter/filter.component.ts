import { Component, OnInit } from '@angular/core';
import { SentimentService } from 'src/app/services/sentiment.service';

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
    options:any;

    constructor(private service:SentimentService) { }

    ngOnInit() {}

    filter()
    {
        this.service.course = this.classCategory;
        // gets today date and calculates date field
        this.loadDate();
        console.log(this.service.date)
        
        this.service.getMessageData(this.service.course, this.service.date).then(response => {
            console.log(response);
            
            switch (this.timeFilterCategory)
            {
                case "All time":
                    this.graphData('year', this.All_time, response);
                    break;
                case "Past year":
                    this.graphData('month', this.year, response);
                    break;
                case "Past week":
                    this.graphData('day', this.week, response);
                    break;
                case "Past day":
                    this.graphData('hour', this.day, response);
                    break;
            } 
        });
    }

    graphData(interval, parseData, rawData)
    {
        var xAxisData = [];
        var seriesData = [];
        var values = parseData(rawData, this.sortObj);
        for (var i = 0; i < values.length; i++)
        {
            xAxisData.push(values[i][interval]);
            seriesData.push((values[i]['avg']));
        }
        this.options = {
            legend: {
                data: [interval],
                align: 'left',
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [{
                name: 'sentiment',
                type: 'line',
                data: seriesData,
                animationDelay: (idx) => idx * 10,
            },],
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx) => idx * 5,
        };
    }

    loadDate()
    {
        //let today = new Date();
        // load dummy date so there's graphs for the day/week/month views, since we don't update data yet
        let today = this.loadMockDate();
        switch (this.timeFilterCategory)
        {
            case "Past day":
                this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000));
                break;
            case "Past week":
                this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000 * 7));
                break;
            case "Past month":
                this.service.date = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case "Past year":
                this.service.date = new Date(today.getTime() - (24 * 60 * 60 * 1000 * 365));
                break;
            default:
                this.service.date = new Date(0);
                break;
        }
    }

    // finds most recent date to display values for
    loadMockDate()
    {
        if (this.service.course === 'cs143a')
        {
            return new Date('2020-11-28T21:00:19.636+00:00');
        }
        else if (this.service.course === 'inf133')
        {
            return new Date('2020-11-11T06:01:11.642+00:00');
        }
    }

    // averages sentiment values by day
    week(rawData, sortObj)
    {
        var weekdays = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
        var dayCounts = {'Sun':0,'Mon':0,'Tues':0,'Wed':0,'Thurs':0,'Fri':0,'Sat':0};
        var dayTotals = {'Sun':0,'Mon':0,'Tues':0,'Wed':0,'Thurs':0,'Fri':0,'Sat':0};
        for (var i = 0; i < rawData.length; i++)
        {
            var day = new Date(rawData[i].timestamp).getDay();
            dayCounts[weekdays[day]]++;
            dayTotals[weekdays[day]] += rawData[i].sentiment;
        }
        weekdays.forEach( (day) => {
            dayCounts[day] /= dayTotals[day];
        });
        var parsedData = [];
        for (var d in dayCounts)
            parsedData.push({'day': d, 'avg': dayCounts[d]});
        return parsedData;
    }

    // averages sentiment values by hour
    day(rawData, sortObj) {
        var day_result = {};
        var parsedData = [];
        for (var i = 0; i < rawData.length; i++)
        {
            var hour = new Date(rawData[i].timestamp).getHours();
            if (!(hour in day_result))
            {
                day_result[hour] = [rawData[i].sentiment, 1]
            }
            else if (hour in day_result)
            {
                day_result[hour][0] += rawData[i].sentiment;
                day_result[hour][1]++;
            }
        }
        for (var h = 0; h < 24; h++)
            parsedData.push({'hour': h.toString() + ":00", 'avg': day_result[h][0] / day_result[h][1]});
        return parsedData;
    }

    // averages sentiment values by month
    year(rawData, sortObj)
    {
        var year_result = {};
        var final = new Array();
        var year_key = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' };
        for (var x = 0; x < rawData.length; x++)
        {
            var month = new Date(rawData[x].timestamp).getMonth();
            if (!(month in year_result))
            {
                year_result[month] = [rawData[x].sentiment, 1]
            }
            else if (month in year_result) {
                year_result[month][0] += rawData[x].sentiment;
                year_result[month][1]++;
            }
        }
        const sorted_months = sortObj(year_result);

        for (var m in sorted_months) {
            final.push({ 'month': year_key[m], 'avg': sorted_months[m][0] / sorted_months[m][1]});
        }
        return final;
    }

    // averages sentiment values by year
    All_time(rawData, sortObj)
    {
        var year_result = {};
        var final = [];
        for (var x = 0; x < rawData.length; x++)
        {
            var year = new Date(rawData[x].timestamp).getFullYear();
            if (!(year in year_result))
            {
                year_result[year] = [rawData[x].sentiment, 1]
            }
            else if (year in year_result)
            {
                year_result[year][0] += rawData[x].sentiment;
                year_result[year][1]++;
            }
        }
        const sorted_years = sortObj(year_result);
        for (var y in sorted_years)
        {
            final.push({ 'year': y, 'avg': sorted_years[y][0] / sorted_years[y][1]})
        }

        return final;
    }

    sortObj(obj)
    {
        return Object.keys(obj).sort().reduce( (result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
    }
}