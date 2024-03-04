import { Component, OnInit } from '@angular/core';
import { ParametrosService } from 'src/app/protected/services/parametros.service';

@Component({
  selector: 'app-terminos-condiciones-dialog',
  templateUrl: './terminos-condiciones-dialog.component.html',
  styleUrls: ['./terminos-condiciones-dialog.component.css']
})
export class TerminosCondicionesDialogComponent implements OnInit{

  contenidoHTML: string | undefined;
  loading: boolean = false;

  constructor(private parametrosService: ParametrosService) { }

  ngOnInit(): void {
    this.getTermsConditions();
  }

  getTermsConditions() {
    // Bloquear la pantalla
    this.loading = true;
    this.parametrosService.getTerms()
      .subscribe(ok => {
        this.contenidoHTML = ok;
      }).add(() => {
        // Desbloquear la pantalla cuando se complete la operación
        this.loading = false;
      });
  }
}
