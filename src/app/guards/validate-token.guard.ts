import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


export class ValidateTokenGuard implements CanActivate, CanLoad {
  canActivate(): Observable<boolean> | boolean {
    return true;
  }

  canLoad(): Observable<boolean> | boolean {
    return true;
  }


}
