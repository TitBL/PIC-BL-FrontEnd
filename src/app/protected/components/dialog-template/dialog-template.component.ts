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
  public dialogWidth: string = '400px';

  constructor(public dialogRef: MatDialogRef<DialogTemplateComponent>,  
              @Inject(MAT_DIALOG_DATA) public data: any) {
                
              }

  onClick(confirm:boolean): void {
    this.dialogRef.close(confirm);
  }

  ngOnInit(): void {
    
    if (this.data && this.data.title) {
      this.title = this.data.title;
    }
    if (this.data && this.data.message) {
      this.message = this.data.message;
    }
  }

  // Método para establecer el título
  setTitle(title: string): void {
    this.title = title;
  }

  // Método para establecer el mensaje
  setMessage(message: string): void {
    this.message = message;
  }

  // Método para establecer el ancho del diálogo
  setDialogWidth(width: string): void {
    this.dialogWidth = width;
  }
}
