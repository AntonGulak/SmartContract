import { UnprocessableEntityError } from "../error/unprocessable-entity.error";
import { NumberValidatorDto } from "./dto/number-validator.dto";
import { Validator} from "./validator";

export class NumberValidator extends Validator {

    private val: number;
    private options: NumberValidatorDto;

    constructor(valToValidate: number, options: NumberValidatorDto) {
        super();
        this.val = valToValidate;
        this.options = options;
    }

    validate() : void {
        this.checkIsNumber();
        if (this.hasErrors()) {
            return ;
        }
        if (this.options.minValue !== undefined) {
            this.checkMinValue();
        }
        if (this.options.minStrictValue !== undefined) {
            this.checkMinStrictValue();
        }
    }

    private checkIsNumber() : void {
        if (isNaN(this.val)) {
            if (this.val === undefined) {
                this.addError(`Is not set.`);
            }
            else {
                this.addError(`"${ this.val }" should be a number.`);
            } 
        }
    }

    private checkMinValue() : void {
        if (this.val < (this.options.minValue as number)) {
            this.addError(`"${ this.val }" should be greater or equal ${ this.options.minValue }.`);
        }
    }

    private checkMinStrictValue() : void {
        if (this.val <= (this.options.minStrictValue as number)) {
            this.addError(`"${ this.val }" should be greater than ${ this.options.minStrictValue }.`);
        }
    }
}