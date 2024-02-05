import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadosEnum } from '../../enums/estados.enum';

@Component({
  selector: 'app-estado-select',
  templateUrl: './estado-select.component.html',
  styleUrls: ['./estado-select.component.css']
})
export class EstadoSelectComponent implements OnInit{
  selectedState: string | undefined;

  ngOnInit(): void {
    this.statesList.sort((a, b) => a.name.localeCompare(b.name));
    this.selectedState = this.statesList[0].value;
  }
  statesList = Object.keys(EstadosEnum).map((key) => ({
    name: key,
    value: EstadosEnum[key as keyof typeof EstadosEnum],
  }));
  
  
  @Output() stateSelected = new EventEmitter<string>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;

  onStateChange() {
    if (this.selectedState !== undefined) {
      this.stateSelected.emit(this.selectedState);
    }
  }
}
