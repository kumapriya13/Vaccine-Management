import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal-receipent-preview',
  templateUrl: './modal-receipent-preview.component.html',
  styleUrls: ['./modal-receipent-preview.component.scss'],
})
export class ModalReceipentPreviewComponent implements OnInit {
  dialCode: string = '+1';
  iso2: string = 'us';

  hide: boolean = false;
  passwordToggler: boolean;
  authRecipientSignUpForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalReceipentPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any
  ) {}

  ngOnInit(): void {
    this.buildForm(this.inputData.formData);
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  buildForm(dataFromLoc) {
    this.dialCode = dataFromLoc['dialCode'];
    this.iso2 = dataFromLoc['iso2'];

    this.authRecipientSignUpForm = this._formBuilder.group({
      firstName: [dataFromLoc['firstName']],
      lastName: [dataFromLoc['lastName']],
      dob: [dataFromLoc['dob']],
      gender: [dataFromLoc['gender']],
      phone: [dataFromLoc['phone']],
      email: [dataFromLoc['email']],
      primaryType: [dataFromLoc['primaryType']],
      address1: [dataFromLoc['address1']],
      address2: [dataFromLoc['address2']],
      address3: [dataFromLoc['address3']],
      homePhoneNumber: [dataFromLoc['homePhoneNumber']],
      city: [dataFromLoc['city']],
      password: [dataFromLoc['password']],
      confirmPassword: [dataFromLoc['confirmPassword']],
      zip: [dataFromLoc['zip']],
      termandCondition: [dataFromLoc['termandCondition']],
      state: [dataFromLoc['state'], null],
      country: [dataFromLoc['country'], null],
      county: [dataFromLoc['county']],
      insurance: [dataFromLoc['insurance']],
      insuranceprovidername: [dataFromLoc['insuranceprovidername']],
      medicalGroupNumber: [dataFromLoc['medicalGroupNumber']],
      memberId: [dataFromLoc['memberId']],
      answers: this._formBuilder.group({
        ethnicgroup: [dataFromLoc['answers']['ethnicgroup']],
        raceFormArray: this._formBuilder.array(
          dataFromLoc['answers']['raceFormArray']
        ),
        applyAllFormArray: this._formBuilder.array(
          dataFromLoc['answers']['applyAllFormArray']
        ),
        prescriptionQ: [dataFromLoc['answers']['prescriptionQ']],
        allergiestomedications: [
          dataFromLoc['answers']['allergiestomedications'],
        ],
        otherillnesses: [dataFromLoc['answers']['otherillnesses']],
        chronicorlongstanding: [
          dataFromLoc['answers']['chronicorlongstanding'],
        ],
      }),
    });
  }

  closeTheDialog(action: string): void {
    this.dialogRef.close({ action: action });
  }
}
