import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportByDocumentType } from 'src/app/protected/interfaces/reporte';
import { TableData } from 'src/app/protected/interfaces/table-data';
import { EmpresaService } from 'src/app/protected/services/empresa.service';
import { PermissionsService } from 'src/app/protected/services/permissions.service';
import { ReporteService } from 'src/app/protected/services/reporte.service';
import { CommonService } from 'src/app/shared/common.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-reporte-recibidos-por-anio',
  templateUrl: './reporte-recibidos-por-anio.component.html',
  styleUrls: ['./reporte-recibidos-por-anio.component.css']
})
export class ReporteRecibidosPorAnioComponent {
  displayedColumns: string[] = ['Anio', 'Factura', 'LiquidacionCompra', 'NotaCredito', 'NotaDebito', 'GuiaRemision', 'Retencion', 'Total', 'AverageMonth', 'AverageDay'];
  loading = false;
  dataSource: TableData | undefined;
  selectedBusinessId: number | undefined;
  selectedBusinessName: string | undefined;
  dataSourceTable = new MatTableDataSource<ReportByDocumentType>();

  constructor(private reporteService: ReporteService,
    private permissionsService: PermissionsService,
    private commonService: CommonService,
    private empresaService: EmpresaService
  ) { }

  onEmpresaSelected(selectedBusinessId: number) {
    this.loading = true;
    this.getReportEmitidos(selectedBusinessId);
    this.selectedBusinessId = selectedBusinessId;
    this.getBusinessById(this.selectedBusinessId);
  }


  getBusinessById(id: number): void {
    this.empresaService.getBusinessById(id).subscribe(response => {
      if (response.Success === true) {
        this.selectedBusinessName = response.Data?.NombreComercial ?? '';
      } else {
        this.commonService.notifyErrorResponse('Ha ocurrido un error en la consulta');
      }
    });
  }

  getReportEmitidos(idEmpresa: number): void {
    this.loading = true;
    this.reporteService.getReportDocumentsByTypeAndBusiness('received', idEmpresa).subscribe(response => {
      if (response !== undefined) {
        this.dataSourceTable.data = response.Data ?? [];
        this.dataSource = this.createTableDataFromJson(response.Data ?? []);
        console.log(this.dataSource);
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

  // Función para crear el objeto TableData a partir del JSON
  createTableDataFromJson(jsonData: ReportByDocumentType[]): any {
    if (jsonData.length !== 0) {
      const tableData: TableData = {
        columns: [{ type: 'string', label: 'Tipo de Documento' }],
        rows: []
      };

      // Iterar sobre las filas del JSON
      jsonData.forEach(column => {
        const newColumn: any = { type: 'number', label: column.Year.toString() }; // Añadir el año como primera columna
        tableData.columns.push(newColumn); // Añadir la columna al objeto TableData
      });

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
          newRow.push(index[docType.property]);
        });
        tableData.rows.push(newRow);
      });
      return tableData;
    }
    return undefined;
  }

  exportReportPDF(): void {
    const originalElement = document.querySelector('app-reporte-recibidos-por-anio');

    if (originalElement instanceof HTMLElement) {
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;

      const button = clonedElement.querySelector('button');
      if (button) {
        button.style.display = 'none';
      }

      const empresaSelect = clonedElement.querySelector('app-empresa-select');
      if (empresaSelect) {
        empresaSelect.classList.add('hide-on-export');
      }

      const titleElement = document.createElement('h1');
      titleElement.textContent = `Reporte Documentos Recibidos por Año - ${this.selectedBusinessName ?? ''}`;
      clonedElement.insertBefore(titleElement, clonedElement.firstChild);

      const options = {
        margin: 0.8,
        filename: `ReporteDocRecibidos_${this.selectedBusinessName ?? ''}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      html2pdf().from(clonedElement).set(options).toPdf().save();
    }
  }
}
