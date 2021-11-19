export class SuccessResponse {
    status = 200;
    message = 'OK';

    constructor(public data: object) {}
}
