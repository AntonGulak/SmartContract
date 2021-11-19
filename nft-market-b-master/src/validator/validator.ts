export abstract class Validator {
    
    private errors: Array<string>; 
    constructor() {
        this.errors = [];
    }

    protected addError (message: string) : void {
        this.errors.push(message);
    }

    getErrors() : Array<string>{
        return this.errors;
    }

    hasErrors() : boolean {
        return !!this.errors.length;
    }

    

    abstract validate() : void;
}