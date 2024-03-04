import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SMTPSecurityTypeEnum } from 'src/app/protected/enums/SMTPSecurityType.enum';
import { ViewParameters } from 'src/app/protected/interfaces/parameter';
import { UserSession } from 'src/app/protected/interfaces/usersession';
import { ParametrosService } from 'src/app/protected/services/parametros.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  parametros: ViewParameters = {
    urlApi: '',
    mail: '',
    password: '',
    port: '',
    server: '',
    type_security: 0,
    user: ''
  }; // Modelo para almacenar los parámetros

  selectedSecurityType: SMTPSecurityTypeEnum | undefined;
  loading: boolean = false;

  // User session data
  _userSession!: UserSession;

  constructor(private parametrosService: ParametrosService,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.getUserSession();
    if (this._userSession.IdRol === "1") {
      this.loadParametros();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadParametros() {
    // Bloquear la pantalla
    this.loading = true;
    this.parametrosService.getParametros().subscribe(
      (response) => {
        console.log('PARAMETROS:', response);
        this.parametros = response.Data;
        this.parametros.type_security = parseInt(this.parametros.type_security.toString(), 10);
        console.log(this.parametros);
      },
      (error) => {
        console.error('Error al cargar los parámetros:', error);
      }
    ).add(() => {
      // Desbloquear la pantalla cuando se complete la operación
      this.loading = false;
    });
  }

  saveParametros() {
    // Bloquear la pantalla
    this.loading = true;
    console.log(this.parametros);
    this.parametros.type_security = parseInt(this.parametros.type_security.toString(), 10);
    this.parametrosService.saveParametros(this.parametros).subscribe(
      (response) => {
        this.commonService.notifySuccessResponse('Parámetros guardados exitosamente');
        console.log('Parámetros guardados exitosamente:', response);
      },
      (error) => {
        console.error('Error al guardar los parámetros:', error);
      }
    ).add(() => {
      // Desbloquear la pantalla cuando se complete la operación
      this.loading = false;
    });
  }

  onSecurityTypeSelected(securityType: number) {
    this.selectedSecurityType = securityType;
    this.parametros.type_security = securityType;
  }

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
}
