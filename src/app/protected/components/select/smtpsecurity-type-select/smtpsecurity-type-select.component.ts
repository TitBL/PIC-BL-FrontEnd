import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SMTPSecurityTypeEnum } from '../../../enums/SMTPSecurityType.enum';

@Component({
  selector: 'app-smtpsecurity-type-select',
  templateUrl: './smtpsecurity-type-select.component.html',
  styleUrls: ['./smtpsecurity-type-select.component.css']
})
export class SMTPSecurityTypeSelectComponent implements OnInit{
  securityTypes = Object.keys(SMTPSecurityTypeEnum)
    .filter(key => isNaN(Number(SMTPSecurityTypeEnum[key as keyof typeof SMTPSecurityTypeEnum])))
    .map(key => ({
      name: key,
      value: SMTPSecurityTypeEnum[key as keyof typeof SMTPSecurityTypeEnum],
    }));

  selectedSecurityType: number | undefined;

  @Output() securityTypeSelected = new EventEmitter<number>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;
  @Input() preselectedType: number | undefined; 

  onSecurityTypeChange() {
    if (this.selectedSecurityType !== undefined) {
      this.securityTypeSelected.emit(this.selectedSecurityType);
    }
  }

  ngOnInit() {
    // Verifica si hay un valor preseleccionado y establece selectedSecurityType
    if (this.preselectedType !== undefined) {
      this.selectedSecurityType = this.preselectedType;
    }
  }
}
