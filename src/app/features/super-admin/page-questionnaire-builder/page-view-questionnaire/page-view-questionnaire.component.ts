import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SuperAdminService } from '../../../../core';
import { COUNTIES } from '../../../../shared/helpers/constant';
import { EditQuestionDialog } from './edit-questionnaire-dialog/edit-question-dialog';

@Component({
  selector: 'app-page-view-questionnaire',
  templateUrl: './page-view-questionnaire.component.html',
  styleUrls: ['./page-view-questionnaire.component.scss']
})
export class PageViewQuestionnaireComponent implements OnInit {
  changeToSave: boolean = false;
  counties = COUNTIES;
  countiesEdit: boolean = false;
  questionnaire_id: any;
  questionnaire: any;
  removable: boolean = true;
  selectable: boolean = true;
  instructionEdit: boolean = false;


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private questionService: SuperAdminService,
  ) { }

  ngOnInit(): void {
    this.questionnaire_id = this._route.snapshot.paramMap.get('id');
    this.getQuestionnaire();
  }

  getQuestionnaire() {
    this.questionService.getQuestionnaire({ id: this.questionnaire_id }).subscribe(res => {
      this.questionnaire = res;
    });
  }

  deleteQuestion(index) {
    this.questionnaire.dynamic_questionnaire_answers.splice(index, 1);
    this.changeToSave = true;
  }

  editCounties() {
    this.countiesEdit = !this.countiesEdit;
  }

  editInstruction() {
    this.instructionEdit = !this.instructionEdit;
  }

  saveField(key, value) {
    this.questionnaire[key] = value;
  }

  removeCounty(index) {
    this.questionnaire.county.splice(index, 1);
    this.save();
  }

  save() {
    console.log('view page',this.questionnaire);
    this.questionService.saveQuestionnaire(this.questionnaire)
      .subscribe((results) => console.log('Update Questionnaire', results), (e) => console.log(e));
    this.instructionEdit = false;
    this.countiesEdit = false;
  }

  openDialog(index): void {
    const dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '60%',
      data: {
        index: index,
        questionnaire: this.questionnaire
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
