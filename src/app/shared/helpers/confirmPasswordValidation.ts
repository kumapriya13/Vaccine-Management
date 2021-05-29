import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";



@Directive({
    selector: '[appConfirmEqualValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ConfirmEqualValidatorDirective,
        multi: true
    }]
})
export class ConfirmEqualValidatorDirective implements Validator {
    @Input() appConfirmEqualValidator: string;

    validate(control: AbstractControl): ValidationErrors | null {
        const controlToCompare = control.parent.get(this.appConfirmEqualValidator);
        return controlToCompare && controlToCompare.value === control.value ? null : { notSame: true };
    }


} 