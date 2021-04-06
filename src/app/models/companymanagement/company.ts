import { User } from '../../models/user';
import { Currency } from '../../models/base/currency';
import { CompanyType } from './companytype';
import { Country } from '@angular-material-extensions/select-country'; 
import { Membership } from './membership';

export class Company {
    id : number;
    user?: User;
    company_type?: CompanyType;
    display_name?: string;
    fiscal_code?: string;
    vat_code?: string;
    country?: Country;
    phone?: string;
    fax?: string;
    currency?: Currency;
    share_capital?: number;
    paied_up_capital?: string;
    start_date?: Date;
    end_date?: Date;
    membership?: Membership;
    active?: number;
    personal_code?: string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.user = data.user ? new User(data.user) : null;
        
        if(data.company_type_id) {
            this.company_type = new CompanyType({});
            this.company_type.id = data.company_type_id
        }
        else
            this.company_type = data.company_type ? new CompanyType(data.company_type) : null;
              
        this.display_name = data.display_name;
        this.fiscal_code = data.fiscal_code;
        this.vat_code = data.vat_code;
        this.country = data.country;
        this.phone = data.phone;
        this.fax = data.fax;
        
        if(data.currency_id) {
            this.currency = new Currency({});
            this.currency.id = data.currency_id;
        }
        else
            this.currency = data.currency ? new Currency(data.currency) : null;
            
        this.share_capital = data.share_capital ? data.share_capital : 0;
        this.paied_up_capital = data.paied_up_capital ? data.share_capital : 0;
        this.start_date = data.start_date ? new Date(data.start_date) : null;
        this.end_date = data.end_date ? new Date(data.end_date) : null;
        this.membership = data.membership ? new Membership(data.membership) : null;
        this.personal_code = data.personal_code;
   }
}