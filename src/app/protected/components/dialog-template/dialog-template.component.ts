import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.css']
})
export class DialogTemplateComponent implements OnInit {
  public title:string = 'Confirmar';
  public message : string = '¿Está seguro?';


  constructor(public dialogRef: MatDialogRef<DialogTemplateComponent>,  
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onClick(confirm:boolean): void {
    this.dialogRef.close(confirm);
  }

  ngOnInit(): void {
    this.title = this.data['title'];
    this.message = this.data['message'];
  }
}
