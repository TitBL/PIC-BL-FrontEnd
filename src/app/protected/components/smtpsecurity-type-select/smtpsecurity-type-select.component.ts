import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SMTPSecurityTypeEnum } from '../../enums/SMTPSecurityType.enum';

@Component({
  selector: 'app-smtpsecurity-type-select',
  templateUrl: './smtpsecurity-type-select.component.html',
  styleUrls: ['./smtpsecurity-type-select.component.css']
})
export class SMTPSecurityTypeSelectComponent {
  securityTypes = Object.keys(SMTPSecurityTypeEnum).map((key) => ({
    name: key,
    value: SMTPSecurityTypeEnum[key as keyof typeof SMTPSecurityTypeEnum],
  }));
  
  selectedSecurityType: number | undefined;
  
  @Output() securityTypeSelected = new EventEmitter<number>();
  @Input() classes: string[] = [];

  onSecurityTypeChange() {
    if (this.selectedSecurityType !== undefined) {
      this.securityTypeSelected.emit(this.selectedSecurityType);
    }
  }
}
