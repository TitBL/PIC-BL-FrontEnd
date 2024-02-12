import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { SessionVariables } from 'src/app/auth/enums/sessionVariables';
import { ApiRoutes } from 'src/app/shared/api-routes';
import { CommonService } from 'src/app/shared/common.service';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  // Available permissions in the application
  private availablePermissions: Set<number> = new Set<number>();
  constructor(private cryptoService: CryptoService, 
    private commonService: CommonService,
    private http: HttpClient) { }

  get avaliableP(): Set<number> {
    return { ...this.availablePermissions };
  }

  /**
    * Configures user permissions when initializing the service.
    * @param userPermissions An array of user permissions.
    */
  configurePermissions(userPermissions: number[]): void {
    this.availablePermissions = new Set([...this.availablePermissions, ...userPermissions]);
  }

  /**
  * Checks if the user has a specific permission.
  * @param permission The permission to check.
  * @returns True if the user has the specified permission; otherwise, false.
  */
  hasPermission(permission: number = 0): boolean {
    const datosEnSessionStorage = sessionStorage.getItem(SessionVariables.Permisos);
    // Verificar si datosEnSessionStorage no es null antes de intentar desencriptar
    if (datosEnSessionStorage !== null) {
        let permisosDisponibles = this.cryptoService.decrypt(datosEnSessionStorage);
        // Verificar si permisosDisponibles no es null antes de realizar la comparación
        return (permisosDisponibles?.includes(permission));
    }
    // Devolver false si datosEnSessionStorage es null
    return false;
  }

  getPermissions(): Observable<any> {
    const url = ApiRoutes.Role.Get_Permissions;
    const headers = this.commonService.createHeaders();
    return this.http.get<Response>(url, { headers }).pipe(
      tap(resp => {return resp}),
      catchError(this.commonService.handleError)
    );
  }
}
