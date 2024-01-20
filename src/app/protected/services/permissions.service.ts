import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  // Available permissions in the application
  private availablePermissions: Set<number> = new Set<number>();
  constructor(private cryptoService: CryptoService) { }

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
    const datosEnLocalStorage = localStorage.getItem('Permisos');
    // Verificar si datosEnLocalStorage no es null antes de intentar desencriptar
    if (datosEnLocalStorage !== null) {
        let permisosDisponibles = this.cryptoService.decrypt(datosEnLocalStorage);
        // Verificar si permisosDisponibles no es null antes de realizar la comparación
        return (permisosDisponibles?.includes(permission));
    }
    // Devolver false si datosEnLocalStorage es null
    return false;
  }
}
