import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-vacation',
  templateUrl: './add-vacation.component.html',
  styleUrls: ['./add-vacation.component.css'],
})
export class AddVacationComponent implements OnInit {
  public country = new FormControl('', [Validators.required]);
  public form = new FormGroup({
    country: this.country,
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  public countries: string[] = [];
  public filteredCountries!: Observable<string[]>;
  constructor(
    private httpService: HttpService,
    private dateAdapter: DateAdapter<Date>
  ) {}
  ngOnInit(): void {
    this.httpService.getCountryNames().subscribe((res) => {
      this.countries = res.map(({ name }) => name.common);
      this.filteredCountries = this.country.valueChanges.pipe(
        startWith(''),
        map((value) => {
          console.log(this._filter(value || ''));
          return this._filter(value || '');
        })
      );
    });
    this.dateAdapter.setLocale('he');
  }

  private _filter(value: string): string[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.countries.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  public onSubmit() {
    console.log(this.form);
  }
}
