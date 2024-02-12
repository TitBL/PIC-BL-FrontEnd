import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey: string;

  constructor() {
    this.secretKey = environment.secretKeyCryptoService; // Obtén la clave desde un archivo de configuración o de otro origen
  }
 // private secretKey = environment.secretKeyCryptoService;

  encrypt(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return  JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  }

}
