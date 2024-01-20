export interface ViewDocumentReceived {
    Anio: string;
    Mes: string;
    Dia: string;
    FechaDocumento: string;
    FechayHoraAutorizacion: string;
    Emisor: string;
    TipoDocumento: string;
    Documento: string;
    ClaveAcceso: string;
  }

  export interface ViewDocumentIssued {
    Anio: string;
    Mes: string;
    Dia: string;
    FechaDocumento: string;
    FechayHoraAutorizacion: string;
    Receptor: string;
    TipoDocumento: string;
    Documento: string;
    ClaveAcceso: string;
  }