import { EstadosEnum } from "../enums/estados.enum";
import { PermissionsEnum } from "../enums/permissions.enum";
import { Empresa } from "./empresa";

export interface UserSession{
    DNI: string;
    Email: string;
    Empresas: Empresa[];
    Id: number;
    IdRol: string;
    NombreCompleto: string;
    NombreRol: string;
    Permisos : PermissionsEnum[]
}

export interface ViewUsuario{
    id: number;
    DNI: string;
    NombreUsuario: string;
    email: string;
    Rol: string;
    estado: EstadosEnum;
}

export interface NewUsuario{
    id: number;
    IdRol: string;
    DNI: string;
    NombreUsuario: string;
    NombreCompleto: string;
    Direccion: string;
    Email: string;
    Empresas: Empresa[];
    TerminosCondiciones: TerminosCondiciones;
}

export interface TerminosCondiciones{
    Terminos: string;
    Aceptado: string;
    FechaRegistro: string;
}