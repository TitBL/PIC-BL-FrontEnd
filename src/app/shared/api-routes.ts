import { environment } from "src/environments/environment";

// Base paths for API endpoints
const baseSetup: string = '/configuracion';
const baseDocument: string = '/documento';
const baseBusiness: string = '/empresa';
const baseRole: string = '/rol';
const baseUser: string = '/usuario';
const baseReport: string = '/reporte';

/**
 * API Routes for different modules.
 */
export const ApiRoutes = {
    Authentication : {
         /**
     * Authentication endpoints.
     */
        Login: `${environment.baseUrl}/login`,
        Refresh_token: `${environment.baseUrl}/refresh`,
    },

    Setup : {
        /**
     * Configuration endpoints.
     */
        Get_Setup: `${environment.baseUrl + baseSetup}`,
        Update_Settings: `${environment.baseUrl+ baseSetup}`,
        Get_TermsConditions : `${environment.baseUrl+ baseSetup}/terms`,
    },

    Document : {
        /**
     * Document-related endpoints.
     */
        Get_DocReceivedConsumers: `${environment.baseUrl + baseDocument}/list/recibidos/consumidor`,
        Get_DocReceivedBusiness: `${environment.baseUrl + baseDocument}/list/recibidos/empresa`,
        ForwardingDocumentByMail: `${environment.baseUrl + baseDocument}/reenvio`,
        Get_DocIssuedBusiness: `${environment.baseUrl + baseDocument}/list/emitidos/empresa`,
        Download_PDF: `${environment.baseUrl + baseDocument}/descargar/pdf`,
        Download_XML: `${environment.baseUrl + baseDocument}/descargar/xml`,
        View_PDF: `${environment.baseUrl + baseDocument}/visualizar/pdf`,
        View_XML: `${environment.baseUrl + baseDocument}/visualizar/xml`,

    },


    Business : {
        /**
     * Business-related endpoints.
     */
        Get_byState: `${environment.baseUrl + baseBusiness}/list`,
        Get_bySearch: `${environment.baseUrl + baseBusiness}/buscar`,
        Get_byId: `${environment.baseUrl + baseBusiness}`,
        Get_APIKey : `${environment.baseUrl + baseBusiness}/api_key`,
        Update : `${environment.baseUrl + baseBusiness}`,
        New : `${environment.baseUrl + baseBusiness}`,
        Disable : `${environment.baseUrl + baseBusiness}/deshabilitar`,
        Enable : `${environment.baseUrl + baseBusiness}/habilitar`,

    },

    Role : {
        /**
     * Role-related endpoints.
     */
        Get_byState: `${environment.baseUrl + baseRole}/list`,
        Get_bySearch: `${environment.baseUrl + baseRole}/buscar`,
        Get_byId: `${environment.baseUrl + baseRole}`,
        Get_Permissions : `${environment.baseUrl + baseRole}/permisos`,
        Update : `${environment.baseUrl + baseRole}`,
        New : `${environment.baseUrl + baseRole}`,
        Disable : `${environment.baseUrl + baseRole}/deshabilitar`,
        Enable : `${environment.baseUrl + baseRole}/habilitar`,
    },

    User : {
         /**
     * User-related endpoints.
     */
        Get_byState: `${environment.baseUrl + baseUser}/list`,
        Get_Profile: `${environment.baseUrl + baseUser}/perfil`,
        Get_Profile_Dash: `${environment.baseUrl + baseUser}/perfil/dash`,
        Get_bySearch: `${environment.baseUrl + baseUser}/buscar`,
        Get_byId: `${environment.baseUrl + baseUser}`,
        Update : `${environment.baseUrl + baseUser}`,
        Update_Password : `${environment.baseUrl + baseUser}/cambiarpwd`,
        New : `${environment.baseUrl + baseUser}`,
        Disable : `${environment.baseUrl + baseUser}/deshabilitar`,
        Enable : `${environment.baseUrl + baseUser}/habilitar`,
        ResetPassword : `${environment.baseUrl + baseUser}/resetpwd`,
    },
    Report : {
        /**
    * User-related endpoints.
    */
       Get_DocReceived_Business: `${environment.baseUrl + baseReport}/his/docs/empresa/recibidos`,
       Get_DocIssued_Business: `${environment.baseUrl + baseReport}/his/docs/empresa/emitidos`,
       Get_Business_Panel: `${environment.baseUrl + baseReport}/dash`,
   },


};