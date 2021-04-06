import { Company } from './company';

export class Facility {
    id : number;
    company : Company;
    type: string;
    name: string;
    description: string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.company = data.company ? new Company(data.company): null;
        if(this.company == null && data.company_id) {
            this.company = new Company({})
            this.company.id = data.company_id;
        }
        this.type = data.type ? data.type : '';
        this.name = data.name ? data.name: '';
        this.description = data.description ? data.description : '' ;
    }
}
