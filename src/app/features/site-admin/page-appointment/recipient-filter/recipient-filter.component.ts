import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SiteAdminService, SuperAdminService } from 'src/app/core';
import { COUNTIES, ETHNICITY_LIST, raceList, GENDER_TYPES } from 'src/app/shared/helpers/constant';
import { CountriesService } from 'src/app/shared/services/countries.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recipient-filter',
  templateUrl: './recipient-filter.component.html',
  styleUrls: ['./recipient-filter.component.scss'],
})
export class RecipientFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  @Output() selectAll = new EventEmitter();
  @Output() addFilteredRecipients = new EventEmitter();
  @Input() totalCount: number = 0;

  @Input('selectedVaccine') _selectedVaccine: any = null;
  @Input() set selectedVaccine(value: any) {
    this._selectedVaccine = value;
    if (this.filterFormGroup) {
      this.filterChange.emit(this.buildFilterQuery(this.filterFormGroup.value));
    }
  }

  counties = COUNTIES;
  countries: any[];
  races: string[];
  cities: string[];
  genders: string[];
  ethnicity: string[];
  ageList: Array<number>[] = [];
  classifications: string[];

  firstDoseMaterials: any[];
  secondDoseMaterials: any[];

  minAge: number = 0;
  maxAge: number = 100;

  filterFormGroup: FormGroup;

  formGroupSubscription: Subscription;
  genderData = GENDER_TYPES
  listSite = []

  constructor(
    private countryService: CountriesService,
    private siteAdminService: SiteAdminService,
    private fb: FormBuilder,
    private _superAdminService: SuperAdminService

  ) { }

  ngOnInit(): void {
    this.filterFormGroup = this.fb.group({
      city: [],
      ethnicity: [],
      race: [],
      ageRange: [],
      country: [],
      county: [],
      gender: [],
      firstDose: [],
      secondDose: [],
      classification: [],
      zip: [],
      sites: [],
      appointmentDob: []
    })
    this.formGroupSubscription = this.filterFormGroup.valueChanges.pipe(debounceTime(300)).subscribe((filter) => {
      this.filterChange.emit(this.buildFilterQuery(filter));
    });
    this.loadFilterData();
  }

  ngOnDestroy(): void {
    this.formGroupSubscription.unsubscribe();
  }

  resetFilter(): void {
    this.filterFormGroup.reset();
  }

  private loadFilterData(): void {
    this.races = raceList.map(item => item.value);
    this.ethnicity = ETHNICITY_LIST;
    this.countryService.allCountries().subscribe((result) => {
      this.countries = result.Countries;
    });

    this.siteAdminService.getVaccines().subscribe((materials) => {
      this.firstDoseMaterials = materials;
      this.secondDoseMaterials = materials.filter(material => material.no_of_doses_in_series === 2);
    });
    const reqObj = {
      page: 1,
      pageLength: 50,
    };
    this._superAdminService.getSite(reqObj).subscribe((data) => {
      this.listSite = data.results
    });

    this.siteAdminService
      .loadValues(
        'Recipient',
        [
          'city',
          'gender',
          'classification',
          'administered_doses',
          'medical_conditions',
          'employment_type',
        ],
        undefined,
        ['dob'],
      )
      .subscribe((res) => {
        const [result] = res.results;
        const { city, classification, gender } = result.distinct_values;
        this.cities = city;
        this.classifications = classification;
        this.genders = gender;

        const maxDob = result.max?.dob;
        const minDob = result.min?.dob;

        if (maxDob) {
          this.minAge = new Date().getFullYear() - new Date(maxDob).getFullYear();
        }

        if (minDob) {
          this.maxAge = new Date().getFullYear() - new Date(minDob).getFullYear();
        }

        this.ageList.push([12, 17]);
        this.ageList.push([18, 20]);

        for (let index = 2; true; index++) {
          if ((index + 1) * 10 > this.maxAge) {
            break;
          }
          this.ageList.push([index * 10 + 1, (index + 1) * 10]);
        }
      });
  }
  

  private buildFilterQuery(filter: any): string {
    const filters = [];
    if (filter.city) {
      filters.push(`city:"${filter.city}"`);
    }
    if (filter.ethnicity) {
      filters.push(`ethnicity:"${filter.ethnicity}"`);
    }
    if (filter.race) {
      filters.push(`races:"${filter.race}"`);
    }
    if (filter.country) {
      filters.push(`country:"${filter.country}"`);
    }
    if (filter.gender) {
      filters.push(`gender:"${filter.gender}"`);
    }
    if (filter.classification) {
      filters.push(`classification:"${filter.classification}"`);
    }

    if (filter.ageRange || this._selectedVaccine) {
      let setFlag = true;
      let [minAge, maxAge] = filter.ageRange ? filter.ageRange : [12, 0];

      if (maxAge == 0) {
        setFlag = false;
      }
      // Janseen or Mordorna
      if (this._selectedVaccine == '28756daa-e635-4609-bf06-e14c7a6f2a6b' || this._selectedVaccine == '08756daa-e635-4609-bf06-e14c7a6f2a6b') {
        minAge = minAge >= 18 ? minAge : 18;
      }
      // phiffer
      else if (this._selectedVaccine == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
        minAge = minAge >= 12 ? minAge : 12;
      }

      if (setFlag) {
        const minYear = new Date().getFullYear() - maxAge;
        const minDate = new Date(minYear, 0, 1).toISOString().split('T')[0];
        filters.push(`recipientDobOnOrAfter:${minDate}`);
      }
      const maxYear = new Date().getFullYear() - minAge;
      const maxDate = new Date(maxYear, 11, 31).toISOString().split('T')[0];
      filters.push(`recipientDobOnOrBefore:${maxDate}`);
    }

    if (filter.firstDose) {
      filters.push(`administered_doses=${filter.firstDose.id}_DOSE_1`)
    }
    if (filter.secondDose) {
      filters.push(`administered_doses=${filter.secondDose.id}_DOSE_2`)
    }
    if (filter.county) {
      filters.push(`county:"${filter.county}"`);
    }
    if (filter.zip) {
      filters.push(`zip:"${filter.zip}"`);
    }
    if (filter.sites) {
      filters.push(`siteId:"${filter.sites}"`);
    }
    if (filter.appointmentDob) {
      let date = moment(filter.appointmentDob).format('YYYY-MM-DDTHH:mm:ss').toString()
      filters.push(`appointmentStartDate:"${date}"`);
      console.log(date)
    }
    const query = filters.join(' ');
    return query;
  }

  checkAgeItem(ageRange){
    let setFlag=true;
    if (ageRange) {
      let [minAge, maxAge] = ageRange ? ageRange : [12, 0];
      // Janseen or Mordorna
      if (this._selectedVaccine == '28756daa-e635-4609-bf06-e14c7a6f2a6b' || this._selectedVaccine == '08756daa-e635-4609-bf06-e14c7a6f2a6b') {
        setFlag = minAge >= 18 ? true : false;
      }
      // phiffer
      else if (this._selectedVaccine == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
        setFlag = minAge >= 12 ? true : false;
      }
    }
    return setFlag
  }
}
