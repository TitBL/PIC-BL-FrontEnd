import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ViewEmpresaSession } from '../../../interfaces/empresa';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-empresa-select',
  templateUrl: './empresa-select.component.html',
  styleUrls: ['./empresa-select.component.css']
})
export class EmpresaSelectComponent implements OnInit{
  businessList : ViewEmpresaSession[] = [];
 
  constructor(private empresaService : EmpresaService){}

  ngOnInit(): void {
    this.businessList = this.empresaService.getBusinessOfUserSession();
    this.businessList.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
    this.selectedBusiness = this.businessList[0].id;
  }
  
  
  selectedBusiness: number | undefined;
  
  @Output() businessSelected = new EventEmitter<number>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;

  onBusinessChange() {
    if (this.selectedBusiness !== undefined) {
      this.businessSelected.emit(this.selectedBusiness);
    }
  }
}
