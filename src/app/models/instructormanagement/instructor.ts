import { Company } from '../../models/companymanagement/company';
import { User } from '../../models/user';

export class Instructor {
    id?: number
    user? : User;
    company? : Company;
    first_name? : string;
    last_name? : string;
    address? : string;
    zipcode? : string;
    gender? : number;
    birthday? : Date;
    tax_identification_number? : string;
    phone? : string;
    fax? : string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.user = data.user ? new User(data.user) : null;
        
        if(data.company_id) {
            this.company = new Company({});
            this.company.id = data.company_id
        }
        else
            this.company = data.company ? new Company(data.company) : null;
              
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.address = data.address;
        this.zipcode = data.zipcode;
        this.gender = data.gender;
        this.birthday = data.birthday;
        this.tax_identification_number = data.tax_identification_number;
        this.phone = data.phone;
        this.fax = data.fax;
   }
}