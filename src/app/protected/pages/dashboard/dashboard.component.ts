import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistogramBar } from '../../components/histogram/histogram.component';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private empresaService : EmpresaService) { }
 
visualizarPanelEmpresa: boolean = false;

  ngOnInit(): void {
   this.visualizarPanelEmpresa = this.validateBusinessPanel();
  }

  validateBusinessPanel():boolean {
    const businessList = this.empresaService.getBusinessOfUserSession();
    if (businessList.length !== 0) {
    return true;  
    }
    return false;
  }

}
