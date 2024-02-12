import { AfterViewInit, Component, Input } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() data: any[] = [];

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  drawChart(): void {
    // const data = google.visualization.arrayToDataTable([
    //   ['Task', 'Hours per Day'],
    //   ['Work', 11],
    //   ['Eat', 2],
    //   ['Commute', 2],
    //   ['Watch TV', 2],
    //   ['Sleep', 7]
    // ]);

    const data = google.visualization.arrayToDataTable(this.data);

    const options = {
     // title: 'Documentos Recibidos',
      title: this.title,
      is3D: true
    };

    const chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
  }
}
