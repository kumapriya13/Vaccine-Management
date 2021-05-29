import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';

import { SuperAdminService } from '../../../core';

@Component({
  selector: 'app-questionnaire-builder',
  templateUrl: './page-questionnaire-builder.component.html',
  styleUrls: ['./page-questionnaire-builder.component.scss']
})
export class PageQuestionnaireBuilderComponent implements OnInit {
  criteria = {
    "criteria": {},
    "page": 1,
    "pageLength": 10,
    "sort": ""
  };
  dataSource: any;
  displayedColumns: string[] = ['state', 'county', 'numberOfQuestions', 'manage'];


  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private questionService: SuperAdminService,
    private _spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.getQuestionnaires();
  }

  getQuestionnaires() {
    this._spinner.showLoader();
    this.questionService.searchQuestionnaire(this.criteria).subscribe(res => {
      this._spinner.hideLoader();
      console.log(res);
      this.dataSource = res;
    });
  }

  addNew() {
    this._router.navigate(['/super-admin/new-questionnaire']);
  }

  viewQuestionnaire(id) {
    console.log('ID', id);
    this._router.navigate(['/super-admin/view-questionnaire', id]);
  }

  editQuestionnaire(id) {

  }

  deleteQuestionnaire(id) {
    this.questionService.deleteQuestionnaire({ id: id }).subscribe(res => {
      console.log('Delete Questionnaire', res);
      this.getQuestionnaires();
    });
  }
}
