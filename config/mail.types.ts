export type MailConfig = {
 smtp:{host:string;port:number;secure:boolean;user:string;pass:string};
 from:{name:string;email:string};
 admin:string;
};
