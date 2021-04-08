import { Permission } from 'app/models/companymanagement/permission';

export class User {
    id? : number;
    uuid : string;
    name? : string;
    email? : string;

    role? : string;
    permissions?: Array<Permission>;
    active?: number;
    role_relation_id?: number;

    constructor (data : any){
      this.id = data.id;
      this.uuid = data.uuid ? data.uuid : '';
      this.name = data.name ? data.name : '';
      this.email = data.email;
      this.role = data.role;
      
      if(data.permissions != null) {
        this.permissions = [];
        data.permissions.forEach(element => {
          this.permissions.push(new Permission(element));
        });
      }
      this.active = 0;
      this.role_relation_id = 0;
    }
  }