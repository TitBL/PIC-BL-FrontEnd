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
    DNI: string;
    NombreUsuario: string;
    NombreCompleto: string;
    IdRol: number;
    Contrasena: string;
    Email: string;
    Direccion: string;
    TerminosCondiciones?:string;
    TerminosCondicionesAcceptacion?: boolean,
    Empresas: number[];
}

export interface UpdateUsuario{
        NombreUsuario:string;
        NombreCompleto: string;
        IdRol:number;
        Email: string;
        Direccion: string;
        IdUsuario: number;
        TerminosCondiciones: string;
        TerminosCondicionesAcceptacion: boolean;
        Empresas: number[]
}

