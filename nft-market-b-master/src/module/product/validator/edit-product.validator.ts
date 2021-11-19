import { NumberValidatorDto } from "../../../validator/dto/number-validator.dto";
import { StringValidatorDto } from "../../../validator/dto/string-validator.dto";
import { ObjectValidator } from "../../../validator/object.validator";
import { NumberValidator } from "../../../validator/number.validator";
import { StringValidator } from "../../../validator/string.validator";
import { EditProductDto } from "../command/dto/edit-product.dto";

export class EditProductValidator extends ObjectValidator{

    validate(editProductDto : EditProductDto) : boolean{
        this.addValidator('name', new StringValidator(editProductDto.name, <StringValidatorDto> {minLength: 3}));
        //this.addValidator('price', new NumberValidator(editProductDto.price, <NumberValidatorDto> {minStrictValue: 0}));    
        this.executeValidation();
        return !this.hasErrors();
    }


}