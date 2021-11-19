import { ValidationResultDto } from "./dto/validation-result.dto";

export class ValidationResult  {
    private _errorsList: ValidationResultDto = {};

    addError(fieldName: string, message: string) : void{
        this._errorsList[fieldName] 
            ? this._errorsList[fieldName].push(message)
            : this._errorsList[fieldName] = [message];
    }

    addErrors(fieldName: string, messages: [string]) : void{
        this._errorsList[fieldName] = this._errorsList[fieldName]
            ? this._errorsList[fieldName].concat(messages) as [string]
            : messages;
            
    }

    get errorsList() : ValidationResultDto {
        return this._errorsList;
    }

    hasErrors() :boolean {
        return !!Object.keys(this._errorsList).length;
    }
}