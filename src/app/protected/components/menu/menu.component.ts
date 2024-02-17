import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UserSession } from '../../interfaces/usersession';
import { CommonService } from 'src/app/shared/common.service';
import { PermissionsEnum } from '../../enums/permissions.enum';
import { PermissionsService } from '../../services/permissions.service';
import { ModulesEnum } from '../../enums/modules.enum';
import { SectionsEnum } from '../../enums/sections.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  // Observable to check if the device is a handset
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private router: Router,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private permissionsService: PermissionsService) { }
  // Flag to show or hide user session information
  showSession: boolean = false;
  // User session data
  _userSession!: UserSession;

  //******PERMISOS**********/
  // Configuraciones - Empresa
  visualizarEmpresa: boolean = false;
  crearEmpresa: boolean = false;
  editarEmpresa: boolean = false;
  habilitarDeshabilitarEmpresa: boolean = false;

  // Configuraciones - Usuario
  visualizarUsuario: boolean = false;
  crearUsuario: boolean = false;
  editarUsuario: boolean = false;
  habilitarDeshabilitarUsuario: boolean = false;
  asignarEmpresasAUsuario: boolean = false;

  // Mis Documentos - Recibidos
  visualizarDocumentosRecibidos: boolean = false;
  descargarDocumentosRecibidos: boolean = false;
  enviarPorEmailDocumentosRecibidos: boolean = false;

  // Documentos Empresas - Recibidos
  visualizarDocumentosEmpresasRecibidos: boolean = false;
  descargarDocumentosEmpresasRecibidos: boolean = false;
  enviarPorEmailDocumentosEmpresasRecibidos: boolean = false;

  // Documentos Empresas - Emitidos
  visualizarDocumentosEmpresasEmitidos: boolean = false;
  descargarDocumentosEmpresasEmitidos: boolean = false;
  reenviarPorEmailDocumentosEmpresasEmitidos: boolean = false;

  //Reportes
  reporte1: boolean = false;
  reporte2: boolean = false;


  //MODULOS
  configuracionesModule: boolean = false;
  misDocumentosModule: boolean = false;
  documentosEmpresaModule: boolean = false;
  reportesModule: boolean = false;

  //SECCIONES
  generalSection: boolean = false;
  empresaSection: boolean = false;
  usuarioSection: boolean = false;
  rolesSection: boolean = false;

  misDocRecibidosSection: boolean = false;
  docEmpresaRecibidosSection: boolean = false;
  docEmpresaEmitidosSection: boolean = false;

  reportes1Section: boolean = false;
  reportes2Section: boolean = false;



  /**
   * Initializes the component and retrieves the user session data.
   */
  ngOnInit(): void {
    this.getUserSession();
    //#region PERMISOS
    this.visualizarEmpresa = this.hasPermission(PermissionsEnum.VisualizarEmpresa);
    this.crearEmpresa = this.hasPermission(PermissionsEnum.CrearEmpresa);
    this.editarEmpresa = this.hasPermission(PermissionsEnum.EditarEmpresa);
    this.habilitarDeshabilitarEmpresa = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarEmpresa);

    // Configuraciones - Usuario
    this.visualizarUsuario = this.hasPermission(PermissionsEnum.VisualizarUsuario);
    this.crearUsuario = this.hasPermission(PermissionsEnum.CrearUsuario);
    this.editarUsuario = this.hasPermission(PermissionsEnum.EditarUsuario);
    this.habilitarDeshabilitarUsuario = this.hasPermission(PermissionsEnum.HabilitarDeshabilitarUsuario);
    this.asignarEmpresasAUsuario = this.hasPermission(PermissionsEnum.AsignarEmpresasAUsuario);

    // Mis Documentos - Recibidos
    this.visualizarDocumentosRecibidos = this.hasPermission(PermissionsEnum.VisualizarDocumentosRecibidos);
    this.descargarDocumentosRecibidos = this.hasPermission(PermissionsEnum.DescargarDocumentosRecibidos);
    this.enviarPorEmailDocumentosRecibidos = this.hasPermission(PermissionsEnum.EnviarPorEmailDocumentosRecibidos);

    // Documentos Empresas - Recibidos
    this.visualizarDocumentosEmpresasRecibidos = this.hasPermission(PermissionsEnum.VisualizarDocumentosEmpresasRecibidos);
    this.descargarDocumentosEmpresasRecibidos = this.hasPermission(PermissionsEnum.DescargarDocumentosEmpresasRecibidos);
    this.enviarPorEmailDocumentosEmpresasRecibidos = this.hasPermission(PermissionsEnum.EnviarPorEmailDocumentosEmpresasRecibidos);

    // Documentos Empresas - Emitidos
    this.visualizarDocumentosEmpresasEmitidos = this.hasPermission(PermissionsEnum.VisualizarDocumentosEmpresasEmitidos);
    this.descargarDocumentosEmpresasEmitidos = this.hasPermission(PermissionsEnum.DescargarDocumentosEmpresasEmitidos);
    this.reenviarPorEmailDocumentosEmpresasEmitidos = this.hasPermission(PermissionsEnum.ReenviarPorEmailDocumentosEmpresasEmitidos);

    this.reporte1 = this.hasPermission(PermissionsEnum.Reporte1);
    this.reporte2 = this.hasPermission(PermissionsEnum.Reporte2);
    //#endregion

    //#region SECCIONES

    this.generalSection = parseInt(this._userSession.IdRol) !== 1 ? false : true;
    this.empresaSection = this.visualizarEmpresa || this.crearEmpresa || this.editarEmpresa || this.habilitarDeshabilitarEmpresa;
    this.usuarioSection = this.visualizarUsuario || this.crearUsuario || this.editarUsuario || this.habilitarDeshabilitarUsuario || this.asignarEmpresasAUsuario;
    this.rolesSection = parseInt(this._userSession.IdRol) !== 1 ? false : true;

    this.misDocRecibidosSection = this.visualizarDocumentosRecibidos || this.descargarDocumentosRecibidos || this.enviarPorEmailDocumentosRecibidos;
    this.docEmpresaRecibidosSection = this.visualizarDocumentosEmpresasRecibidos || this.descargarDocumentosEmpresasRecibidos || this.enviarPorEmailDocumentosEmpresasRecibidos;
    this.docEmpresaEmitidosSection = this.visualizarDocumentosEmpresasEmitidos || this.descargarDocumentosEmpresasEmitidos || this.reenviarPorEmailDocumentosEmpresasEmitidos;

    this.reportes1Section = this.reporte1;
    this.reportes2Section = this.reporte2;

    //#endregion

    //#region MODULOS
    this.configuracionesModule = this.generalSection || this.empresaSection || this.usuarioSection || this.rolesSection;
    this.misDocumentosModule = this.misDocRecibidosSection;
    this.documentosEmpresaModule = this.docEmpresaEmitidosSection || this.docEmpresaRecibidosSection;
    this.reportesModule = this.reportes1Section || this.reportes2Section;
    //#endregion


  }

  /**
  * Logs out the user and navigates to the authentication page.
  */
  logout() {
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

  /**
   * Retrieves the user session data from the AuthService.
   */
  getUserSession() {
    this.authService.getUserSession().subscribe(
      (data) => {
        this._userSession = data;
        console.log(this._userSession);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  /**
  * Checks if the user has the specified permission.
  * @param permisoId The ID of the permission to check.
  * @returns True if the user has the permission, otherwise false.
  */
  hasPermission(permisoId: number): boolean {
    return this.permissionsService.hasPermission(permisoId);
  }


  // Navigation paths for different modules and features
  private Modulos = {
    Configuraciones: "configuraciones/",
    MisDocumentos: "documentos/",
    DocumentosEmpresa: "documentosempresa/",
    Reportes: "reportes/"
  }

  PATH_Configuraciones = {
    General: {
      name: 'General',
      path: './' + this.Modulos.Configuraciones + 'general/'
    },
    Empresa: {
      name: 'Empresa',
      path: './' + this.Modulos.Configuraciones + 'empresa/'
    },
    Usuario: {
      name: 'Usuario',
      path: './' + this.Modulos.Configuraciones + 'usuario/'
    },
    Roles: {
      name: 'Roles',
      path: './' + this.Modulos.Configuraciones + 'rol/'
    }
  }

  PATH_MisDocumentos = {
    Recibidos: {
      name: 'Recibidos',
      path: './' + this.Modulos.MisDocumentos + 'recibidos/'
    }
  }

  PATH_DocumentosEmpresa = {
    Recibidos: {
      name: 'Recibidos',
      path: './' + this.Modulos.DocumentosEmpresa + 'recibidos/'
    },
    Emitidos: {
      name: 'Emitidos',
      path: './' + this.Modulos.DocumentosEmpresa + 'emitidos/'
    }
  }

  PATH_Reportes = {
    Recibidos: {
      name: 'Recibidos',
      path: './' + this.Modulos.Reportes + 'recibidos/'
    },
    Emitidos: {
      name: 'Emitidos',
      path: './' + this.Modulos.Reportes + 'emitidos/'
    }
  }
}
