export class SentimentData {
    timestamp:Date;
    content:string;
    sentiment:number;

	constructor(objectModel:{}) {
        this.timestamp = objectModel['timestamp'];
        this.content = objectModel['content'];
        this.sentiment = objectModel['sentiment'];  
	}
}
