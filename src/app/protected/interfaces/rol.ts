import { EstadosEnum } from "../enums/estados.enum";

export interface Rol {
    id: number;
    Nombre: string;
    Descripcion: string;
    estado: EstadosEnum;
}

export interface NewRol {
    Nombre: string;
    Descripcion: string;
    Permisos: number[];
}