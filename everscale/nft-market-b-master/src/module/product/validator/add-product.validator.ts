import { NumberValidatorDto } from "../../../validator/dto/number-validator.dto";
import { StringValidatorDto } from "../../../validator/dto/string-validator.dto";
import { ObjectValidator } from "../../../validator/object.validator";
import { NumberValidator } from "../../../validator/number.validator";
import { StringValidator } from "../../../validator/string.validator";
import { AddProductDto } from "../command/dto/add-product.dto";

export class AddProductValidator extends ObjectValidator{

    validate(addProductDto : AddProductDto) : boolean{
        this.addValidator('name', new StringValidator(addProductDto.name, <StringValidatorDto> {minLength: 3}));
        //this.addValidator('price', new NumberValidator(addProductDto.price, <NumberValidatorDto> {minStrictValue: 0}));    
        this.executeValidation();
        return !this.hasErrors();
    }


}