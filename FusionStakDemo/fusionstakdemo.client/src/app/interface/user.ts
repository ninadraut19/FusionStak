export interface IUser {
    id?: number;
    FirstName: string;
    LastName: string;
    Username: string;
    Password: string;
    Role: string;
    Email:string;
  }
 
  export interface UserTable {
    data: IUser[];
    totalItems: number;
  }