import { EstadosEnum } from "../enums/estados.enum";

export interface Empresa {
  RUC: string;
  RazonSocial: string;
  NombreComercial: string;
  PuedeEnviarCorreo: boolean;
  UsaConfiguracionSMTP: boolean;
  Email: string;
  Servidor: string;
  Puerto: number;
  TipoSeguridad: number;
  UsuarioSMTP: string;
  PasswordSMTP: string;
  APIKey: string;
  Logo: string;
}

export interface ViewEmpresa {
  id: number;
  logo: string;
  RUC: string;
  razon_social: string;
  nombre_comercial: string;
  estado: EstadosEnum;
}


