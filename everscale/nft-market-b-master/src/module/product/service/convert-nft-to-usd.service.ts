export class ConvertNftToUsdService {
    private exchangeRate = 0.1539;

    async convert(eth: number): Promise<number> {
        return Promise.resolve(eth * this.exchangeRate);
    }
}
