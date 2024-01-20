import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent {
  @Input() bars: HistogramBar[] = [];
}
export interface HistogramBar {
  label: string;
  value: number;
}