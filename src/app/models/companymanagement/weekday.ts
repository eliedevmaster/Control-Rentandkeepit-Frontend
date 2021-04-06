
export class Weekday {
    id : number;
    name: string;
    days: string;
 
    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.name = data.name ? data.name : '';
        this.days = data.days ? data.days : '';
    }
}