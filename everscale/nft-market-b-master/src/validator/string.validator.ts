import { StringValidatorDto } from "./dto/string-validator.dto";
import { Validator } from "./validator";

export class StringValidator extends Validator {

    private str: string;
    private options: StringValidatorDto;
    

    constructor(strToValidate: string, options: StringValidatorDto) {
        super();
        this.str = strToValidate;
        this.options = options;
    }

    validate() : void {
        this.checkIsSet();
        if (this.hasErrors()) {
            return ;
        }
        if (this.options.minLength) {
            this.checkMinLength();
        }
    }

    private checkIsSet() : void {
        if (this.str === undefined || this.str === null) {
            this.addError(`Is not set.`);
        }
    }

    private checkMinLength() : void {
        if (this.str.length < (this.options.minLength as number)) {
            this.addError(`"${ this.str }" is too short. Needs at least ${ this.options.minLength } symbols`);
        }
    }


}