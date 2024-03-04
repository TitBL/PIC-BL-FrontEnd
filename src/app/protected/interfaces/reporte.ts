export interface ReportByDocumentType {
    Year: number;
    Factura: number;
    LiquidacionCompras: number;
    NotaCredito: number;
    NotaDebito: number;
    GuiaRemision: number;
    Retencion: number;
    Total: number;
    AverageMonth: number;
    AverageDay: number
 
}

export interface HistogramTransactions{
    day: string;
    transac : string;
}

export interface LastTransactions {
    document_issuer: string;
    document_number: string;
    document_type: string;
    emission_date: string;
    key_access_sri: string;
}