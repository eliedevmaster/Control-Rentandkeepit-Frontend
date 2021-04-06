export class Currency {
    id : number;
    currency : string;
    created_at? : Date;
    updated_at? : Date;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.currency = data.currency ? data.currency : '';
    }
}
