
export class Timeschedule {
    id : number;
    name: string;
    start_time: string;
    end_time: string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.name = data.name ? data.name : '';
        this.start_time = data.start_time ? data.start_time : '';
        this.end_time = data.end_time ? data.end_time : '';
    }
}