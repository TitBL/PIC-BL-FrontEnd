import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ViewEmpresaSession } from '../../../interfaces/empresa';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-empresa-select',
  templateUrl: './empresa-select.component.html',
  styleUrls: ['./empresa-select.component.css']
})
export class EmpresaSelectComponent implements OnInit {
  @Output() businessSelected = new EventEmitter<number>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;
  @Input() preselectedBusiness: number | undefined;

  selectedBusiness: number | undefined;
  searchTerm: string = '';
  businessList: ViewEmpresaSession[] = [];
  filteredBusinessList: any[] = []; // Lista filtrada de empresas

  constructor(private empresaService: EmpresaService) {

    this.businessList = this.empresaService.getBusinessOfUserSession();
    if (this.businessList.length !== 0) {
      this.businessList.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
      this.selectedBusiness = this.businessList[0].id;
      this.filteredBusinessList = this.businessList.slice();
    }
  }

  ngOnInit(): void {
    if (this.preselectedBusiness !== undefined) {
      this.selectedBusiness = this.preselectedBusiness;
    } else {
      this.businessSelected.emit(this.selectedBusiness);
    }
  }

  onBusinessChange() {
    if (this.selectedBusiness !== undefined) {
      this.businessSelected.emit(this.selectedBusiness);
    }
  }

  compareBusiness(business1: any, business2: any): boolean {
    return business1 && business2 ? business1.id === business2.id : business1 === business2;
  }

  filterBusinessList(event: any) {
    const inputValue = (event?.target?.value || '').toLowerCase(); // Verificación adicional
    this.filteredBusinessList = this.businessList.filter(business =>
      business.nombreComercial.toLowerCase().includes(inputValue)
    );

    // Limpiar la selección cuando se filtra
    this.selectedBusiness = undefined;

    // Emitir el evento con el valor undefined cuando no haya ninguna empresa seleccionada
    this.businessSelected.emit(this.selectedBusiness);


    if (this.filteredBusinessList.length === 1) {
      this.selectedBusiness = this.filteredBusinessList[0].id;
      this.onBusinessChange();
    }
  }
}
