export type UserRole = 'admin' | 'user';
export type AccountType = 'none' | 'author' | 'gallery';

export interface UserModel {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash?: string;
    avatar?: string;
    active: boolean;
    created_at: string;
    role: UserRole;
    wallet: string;
    account_type: AccountType;
    owner_for_id?: number;
}
