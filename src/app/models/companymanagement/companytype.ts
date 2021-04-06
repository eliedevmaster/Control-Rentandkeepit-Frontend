export class CompanyType {
    id : number;
    type : string;
    created_at? : Date;
    updated_at? : Date;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.type = data.type ? data.type : '';
    }
}
