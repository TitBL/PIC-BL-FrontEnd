import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistogramBar } from '../../components/histogram/histogram.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  responseData: any;
  constructor(private router: Router) { }
  histogramData: HistogramBar[] = [
    { label: 'Category A', value: 20 },
    { label: 'Category B', value: 40 },
    { label: 'Category C', value: 60 },
    { label: 'Category D', value: 80 },
    { label: 'Category E', value: 90 },
  ];

  ngOnInit(): void {
    console.log("ngOnInit APLICATION DASHBOARD");
   
  }


}
