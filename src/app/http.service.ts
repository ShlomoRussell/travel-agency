import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) { }

  public getCountryNames() {
   return this.http.get<[any]>('https://restcountries.com/v3.1/all');
 }
}
