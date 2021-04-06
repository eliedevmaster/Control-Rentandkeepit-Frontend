import { Company } from './company';

export class Season {
    id? : number;
    company? : Company
    name? : string;
    description? : string;
    start_date? : Date;
    end_date? : Date;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        
        if(data.company_id) {
            this.company = new Company({});
            this.company.id = data.company_id
        }
        else
            this.company = data.company ? new Company(data.company) : null;

        this.name = data.name ? data.name : '';
        this.description = data.description ? data.description : '';
        this.start_date = data.start_date ? new Date(data.start_date) : null;
        this.end_date = data.end_date ? new Date(data.end_date) : null;
    }
}
