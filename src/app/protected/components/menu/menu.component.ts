import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UserSession } from '../../interfaces/usersession';

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
    private breakpointObserver: BreakpointObserver) { }
 // Flag to show or hide user session information
  showSession: boolean = false;
  // User session data
  _userSession!: UserSession;

  /**
   * Initializes the component and retrieves the user session data.
   */
  ngOnInit(): void {
    this.getUserSession();
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
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
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
