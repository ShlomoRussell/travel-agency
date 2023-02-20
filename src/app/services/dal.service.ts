import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vacation } from '../interfaces/vacation';

@Injectable({
  providedIn: 'root',
})
export class DalService {
  public vacationsList = new BehaviorSubject<Vacation[]>([]);
  constructor() {}
}
