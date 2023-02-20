import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Vacation } from 'src/app/interfaces/vacation';
import { DalService } from 'src/app/services/dal.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-vacation',
  templateUrl: './add-vacation.component.html',
  styleUrls: ['./add-vacation.component.css'],
})
export class AddVacationComponent implements OnInit, OnDestroy {
  // initialize formControls and group keeping the country
  public form = new FormGroup({
    country: new FormControl<string>('', [Validators.required]),
    startDate: new FormControl<Date>(new Date(), [Validators.required]),
    endDate: new FormControl<Date>(new Date(), [Validators.required]),
    notes: new FormControl<string>(''),
  });

  public countries: string[] = [];
  public filteredCountries!: Observable<string[]>;
  private vacation!: Vacation;
  private subscriptions!: Subscription;

  constructor(
    private httpService: HttpService,
    private dateAdapter: DateAdapter<Date>,
    private dal: DalService
  ) {}

  ngOnInit(): void {
    // set the date object to hebrew
    this.dateAdapter.setLocale('he');

    // add all subcriptions to subscriptions in order to unscribe in OnDestroy

    // fetch countries fom api and map over them to vet just the name in the countries array
    this.subscriptions.add(
      this.httpService.getCountryNames().subscribe((res) => {
        this.countries = res.map(({ name }) => name.common);

        // initialize filteredCountries array and pipe the changes from the user for autocomplete
        this.filteredCountries = this.form.controls.country.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
      })
    );

    //set "this.vacation" on any value change from form in order to send it when submitting
    this.subscriptions.add(
      this.form.valueChanges.subscribe(
        (res) =>
          (this.vacation = {
            country: res.country!,
            endDate: res.endDate!,
            startDate: res.startDate!,
            notes: res.notes!,
          })
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // filter through countries array to give autocomplete
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // if the form is valid "submit" it, update the vacations array, and clear the form
  public onSubmit() {
    if (this.form.valid) {
      console.log(this.vacation);
      this.dal.vacationsList.next([
        ...this.dal.vacationsList.value,
        this.vacation,
      ]);
      this.form.reset();
    }
  }
}
