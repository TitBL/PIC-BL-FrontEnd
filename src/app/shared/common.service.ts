import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 
  private token = localStorage.getItem('token');
  private session = localStorage.getItem('session');

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Creates HttpHeaders with the authorization token and session ID.
   * @returns HttpHeaders with authorization information.
   */
  createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'SessionId': `${this.session}`,
      'Content-Type': 'application/json'
    });
  }


  /**
    * Validates whether the provided inputString contains only numbers.
    * @param inputString The string to be validated.
    * @returns True if the string contains only numbers, otherwise false.
    */
  validateOnlyNumbers(inputString: string): boolean {
    const numericRegex: RegExp = /^[0-9]+$/; // Regular expression to match only numbers
    return numericRegex.test(inputString);
  }


   /**
   * Validates whether the provided email is in a valid format.
   * @param email The email to be validated.
   * @returns True if the email is valid, otherwise false.
   */
   validateEmailAddress(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    return emailRegex.test(email);
  }

  isValidImageUrl(url: string): string {
    const imageFormatRegex = /\.(jpeg|jpg|gif|png|bmp)$/;
    return imageFormatRegex.test(url)? url : environment.urlSinImagen;
  }

  downloadPDFFromBytes(documentBytes: Blob, fileName: string): void {
    const blob = new Blob([documentBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  downloadXMLFromBytes(documentBytes: Blob, fileName: string): void {
    const blob = new Blob([documentBytes], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  downloadFileFromBytes(documentBytes: Blob, fileName: string, fileType: string): void {
    const blob = new Blob([documentBytes], { type: fileType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  notifyErrorResponse(message:string){
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: 'app-notification-error'
    });
  }
  
  notifySuccessResponse(message:string){
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: 'app-notification-success'
    });
  }

}