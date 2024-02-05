import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  pdfData!: SafeResourceUrl;

  constructor(public dialogRef: MatDialogRef<PdfViewerComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.data.pdfData));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
