import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportByDocumentType } from 'src/app/protected/interfaces/reporte';
import { TableData } from 'src/app/protected/interfaces/table-data';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { ReporteService } from 'src/app/protected/services/reporte.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-business-panel',
  templateUrl: './business-panel.component.html',
  styleUrls: ['./business-panel.component.css']
})
export class BusinessPanelComponent {
  displayedColumns: string[] = ['TipoDocumento', 'Transacciones'];
  loading = false;
  dataSourceRecibidos: TableData | undefined;
  dataSourceEnviados: TableData | undefined;
  selectedBusinessId: number | undefined;
  selectedBusinessName: string | undefined;
  dataSourceTableRecibidos = new MatTableDataSource<TableData>();
  dataSourceTableEnviados = new MatTableDataSource<TableData>();

  isDataSourceRecEmpty = true;
  isDataSourceEnvEmpty = true;

  months = [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' }
  ];

  years: number[] = [];

  selectedMonth: number = -1;
  selectedYear: number = -1;



  constructor(private reporteService: ReporteService,
    private commonService: CommonService
  ) {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 4; i++) {
      this.years.push(currentYear - i);
    }
  }

  onEmpresaSelected(selectedBusinessId: number) {
    this.selectedBusinessId = selectedBusinessId;
   
  }

  search(){ 
    if (this.selectedBusinessId) {
      if (this.validateParameters()) {
        this.getReport(this.selectedBusinessId);
      }
    }
  }

  validateParameters(): boolean {
    if (this.selectedMonth === -1) {
      this.commonService.notifyErrorResponse('Seleccione un mes');
      return false
    } else if (this.selectedYear === -1) {
      this.commonService.notifyErrorResponse('Seleccione un año');
      return false;
    }
    return true;
  }

  getReport(idEmpresa: number): void {
    this.loading = true;
    this.reporteService.getReportBusinessPanel(idEmpresa, this.selectedMonth, this.selectedYear).subscribe(response => {
      if (response !== undefined) {
        this.dataSourceEnviados = undefined;
        this.dataSourceRecibidos = undefined;
        
        this.dataSourceEnviados = this.createTableDataFromJson(response.Data.docs_enviados ?? []);
        this.dataSourceRecibidos = this.createTableDataFromJson(response.Data.docs_recibidos ?? []);

        const dataEnv = this.createDataSourceForTable(response.Data.docs_enviados ?? []);
        this.dataSourceTableEnviados.data = dataEnv[0];
        this.isDataSourceEnvEmpty = dataEnv[1];
        const dataRec = this.createDataSourceForTable(response.Data.docs_recibidos ?? []);
        this.dataSourceTableRecibidos.data = dataRec[0];
        this.isDataSourceRecEmpty = dataRec[1];

      } else {
        this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
      }
    }, error => {
      console.error('Error:', error);
      this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
    }).add(() => {
      this.loading = false;
    });
  }

  createDataSourceForTable(jsonData: ReportByDocumentType[]): any {
    const dataSource = this.createTableDataFromJson(jsonData);
    if (dataSource !== undefined) {
      return [dataSource.rows, false];
    } else {
      return [[], true];
    }
  }

  // Función para crear el objeto TableData a partir del JSON
  createTableDataFromJson(jsonData: ReportByDocumentType[]): any {
    if (jsonData.length !== 0) {
      const tableData: TableData = {
        columns: [{ type: 'string', label: 'Tipo de Documento' },
        { type: 'number', label: 'Transacciones' }],
        rows: []
      };


      const documentTypes: { key: string, property: keyof ReportByDocumentType }[] = [
        { key: 'Factura', property: 'Factura' },
        { key: 'Liquidación de Compras', property: 'LiquidacionCompras' },
        { key: 'Nota de Crédito', property: 'NotaCredito' },
        { key: 'Nota de Débito', property: 'NotaDebito' },
        { key: 'Guía Remisión', property: 'GuiaRemision' },
        { key: 'Retención', property: 'Retencion' }
      ];

      documentTypes.forEach(docType => {
        const newRow: any[] = [docType.key];
        jsonData.forEach(index => {
          newRow.push(parseInt(index[docType.property].toString()));
        });
        tableData.rows.push(newRow);
      });
      console.log(tableData);
      return tableData;
    }
    return undefined;
  }


}
