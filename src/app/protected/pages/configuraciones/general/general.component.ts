import { Component, OnInit } from '@angular/core';
import { SMTPSecurityTypeEnum } from 'src/app/protected/enums/SMTPSecurityType.enum';
import { ViewParameters } from 'src/app/protected/interfaces/parameter';
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

  constructor(private parametrosService: ParametrosService,
    public commonService: CommonService) { }

  ngOnInit(): void {

    
    // Puedes cargar los parámetros existentes al iniciar el componente si es necesario
    this.loadParametros();

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
}
