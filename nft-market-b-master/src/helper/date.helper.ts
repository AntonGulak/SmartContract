export class DateHelper {
    timestampToDateTime(timestamp: number): string {
        const date = new Date(timestamp);
        return (
            `${ date.getFullYear() }-${ this.fix(date.getMonth() + 1) }-${ this.fix(date.getDate()) } ` +
            `${ this.fix(date.getHours()) }:${ this.fix(date.getMinutes()) }:${ this.fix(date.getSeconds()) }`
        );
    }

    private fix(value: number): string {
        return value < 10 ?
            '0' + value :
            String(value);
    }
}
