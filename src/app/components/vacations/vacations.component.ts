import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vacation } from 'src/app/interfaces/vacation';
import { DalService } from 'src/app/services/dal.service';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css'],
})
export class VacationsComponent implements OnInit, OnDestroy {
  public vacations!: Vacation[];
  private subscriptions: Subscription[] = [];

  constructor(private dal: DalService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.dal.vacationsList
        .asObservable()
        .subscribe((res) => (this.vacations = res))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
