import { ObjectValidatorsDto } from "./dto/object-validators.dto";
import { ValidationResultDto } from "./dto/validation-result.dto";
import { ValidationResult } from "./validation-result";
import { Validator } from "./validator";

export abstract class  ObjectValidator {
    private validators : ObjectValidatorsDto;
    private validationResult : ValidationResult;

    constructor() {
        this.validationResult = new ValidationResult();
        this.validators = {};
    }

    addValidator(fieldName : string, validator: Validator) : void {
        this.validators[fieldName] 
            ? this.validators[fieldName].push(validator)
            : this.validators[fieldName] = [validator];
    }

    abstract validate(validateContent: any) : boolean;

    protected executeValidation() : void {
        for (const fieldName in this.validators)
        this.validators[fieldName].forEach((validator : Validator) => {
            validator.validate();
            if (validator.hasErrors()) {
                this.validationResult.addErrors(fieldName, validator.getErrors() as [string]);
            }
        });
    }

    hasErrors() : boolean {
        return this.validationResult.hasErrors();
    }

    getValidationResult() : ValidationResultDto {
        return this.validationResult.errorsList;
    }


}