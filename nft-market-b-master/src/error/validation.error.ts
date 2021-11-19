import { ValidationResultDto } from "../validator/dto/validation-result.dto";

export class ValidationError extends Error {
    code = 422;
    validationResult : ValidationResultDto;

    constructor(validationResult : ValidationResultDto) {
      super("Validation Error");
      this.validationResult = validationResult;
    }
  }