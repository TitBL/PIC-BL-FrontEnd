import { SMTPSecurityTypeEnum } from "../enums/SMTPSecurityType.enum";

export interface ViewParameters {
    urlApi : string;
    mail: string;
    password: string;
    port: string;
    server: string;
    type_security: SMTPSecurityTypeEnum;
    user: string;
}


export interface UpdateParameters {
    mail: string;
    password: string;
    port: string;
    server: string;
    type_security: SMTPSecurityTypeEnum;
    user: string;
}