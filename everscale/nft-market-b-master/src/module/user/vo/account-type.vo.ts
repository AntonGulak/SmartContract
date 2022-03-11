export class AccountType {
    public static NONE = 'none';
    public static AUTHOR = 'author';
    public static GALLERY = 'gallery';

    private readonly type: string;

    constructor(type: string) {
        this.type = type;
    }

    isOwnerForIdRequired(): boolean {
        return this.type === AccountType.AUTHOR || this.type === AccountType.GALLERY;
    }

}