export interface IUser {
  id?: any;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: any[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  password?: string;
}

export class User implements IUser {
  constructor(
    public id?: any,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: any[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public password?: string
  ) {
    this.id = id ? id : null;
    this.login = login ? login : undefined;
    this.firstName = firstName ? firstName : undefined;
    this.lastName = lastName ? lastName : undefined;
    this.email = email ? email : undefined;
    this.activated = activated ? activated : false;
    this.langKey = langKey ? langKey : undefined;
    this.authorities = authorities ? authorities : undefined;
    this.createdBy = createdBy ? createdBy : undefined;
    this.createdDate = createdDate ? createdDate : undefined;
    this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : undefined;
    this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : undefined;
    this.password = password ? password : undefined;
  }
}
