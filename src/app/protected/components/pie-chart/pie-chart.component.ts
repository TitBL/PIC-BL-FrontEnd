import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { TableData } from '../../interfaces/table-data';

declare var google: any;

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() data: TableData | undefined;
  @Input() id: string = 'piechart_3d';

  private chart: any; // Variable para almacenar la instancia del gráfico

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  ngOnChanges(): void {
    this.drawChart();
  }

  // Función para crear el DataTable a partir de los datos proporcionados
  createDataTable(tableData: TableData): any {
    console.log(tableData);
    var dataTable = new google.visualization.DataTable();

    // Agregar las columnas
    tableData.columns.forEach(column => {
      dataTable.addColumn(column.type, column.label);
    });

    // Agregar las filas
    tableData.rows.forEach(row => {
      dataTable.addRow(row);
    });
    console.log(dataTable);
    return dataTable;
  }


  drawChart(): void {

    var chartContainer = document.getElementById(this.id);
    if (!chartContainer || !this.data) {
      return; // Salir si el contenedor del gráfico o los datos no están disponibles
    }
    
    var data = this.createDataTable(this.data);
    const options = {
      // title: 'Documentos Recibidos',
      title: this.title,
      is3D: true
    };
    if (this.chart) {
      // Limpiar el gráfico existente si existe
      this.chart.clearChart();
    }
    this.chart = new google.visualization.PieChart(chartContainer);
    this.chart.draw(data, options);
  }
}
