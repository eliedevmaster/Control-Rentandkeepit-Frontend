export class Membership {
    id : number;
    name? : string;
    description? : string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.name = data.name ? data.name : '';
        this.description = data.description ? data.description : '';
    }
}