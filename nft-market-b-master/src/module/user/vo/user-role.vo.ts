export class UserRole {
    public static ADMIN = 'admin';
    public static USER = 'user';

    private readonly role: string;

    constructor(role: string) {
        this.role = role;
    }

    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

}