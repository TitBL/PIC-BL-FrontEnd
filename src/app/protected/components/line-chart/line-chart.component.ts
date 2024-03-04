import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { TableData } from '../../interfaces/table-data';

declare var google: any;

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() data: TableData | undefined;
  @Input() id: string = 'linechart_material';

  private chart: any; // Variable para almacenar la instancia del gráfico


  ngAfterViewInit(): void {
    google.charts.load('current', { 'packages': ['line'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  ngOnChanges(): void {
    this.drawChart();
  }

  // Función para crear el DataTable a partir de los datos proporcionados
  createDataTable(tableData: TableData): any {
    var dataTable = new google.visualization.DataTable();

    // Agregar las columnas
    tableData.columns.forEach(column => {
      dataTable.addColumn(column.type, column.label);
    });

    // Agregar las filas
    tableData.rows.forEach(row => {
      dataTable.addRow(row);
    });
    return dataTable;
  }


  drawChart(): void {
    var chartContainer = document.getElementById(this.id);
    if (!chartContainer || !this.data) {
      return; // Salir si el contenedor del gráfico o los datos no están disponibles
    }
    var data = this.createDataTable(this.data);

    var options = {
      chart: {
        title: this.title,
        subtitle: this.subtitle,
      },
      // width: 900,
      // height: 400
    };
    if (this.chart) {
      // Limpiar el gráfico existente si existe
      this.chart.clearChart();
    }

    this.chart = new google.charts.Line(chartContainer);
    this.chart.draw(data, google.charts.Line.convertOptions(options));
  }
}
