import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DocumentTypeEnum } from '../../../enums/documentType.enum';

@Component({
  selector: 'app-document-type-select',
  templateUrl: './document-type-select.component.html',
  styleUrls: ['./document-type-select.component.css']
})
export class DocumentTypeSelectComponent implements OnInit, OnChanges{
  
  ngOnChanges(): void {
    if (this.preselectedDocumentType !== undefined) {
      this.selectedDocumentType = this.preselectedDocumentType;
    }
  }
  ngOnInit(): void {
    this.selectedDocumentType = this.documentTypes[0].value;
    
  }
  documentTypes = Object.keys(DocumentTypeEnum).map((key) => ({
    name: key,
    value: DocumentTypeEnum[key as keyof typeof DocumentTypeEnum],
  }));
  
  selectedDocumentType: string | undefined;
  
  @Output() documentTypeSelected = new EventEmitter<string>();
  @Input() classes: string[] = [];
  @Input() required: boolean = false;
  @Input() preselectedDocumentType : string | undefined;
 
  onDocumentTypeChange() {
    if (this.selectedDocumentType !== undefined) {
      this.documentTypeSelected.emit(this.selectedDocumentType);
    }
  }
}
