import { Validator } from "../validator";

export interface ObjectValidatorsDto {
    [key: string]: [Validator];
}