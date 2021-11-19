export class ErrorResponse {
    status: number;
    message: string;

    constructor(e) {
        this.status = e.code;
        this.message = e.message;
        console.error(e);
    }
}
