export interface CreateUserDto {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    account_type: string;
    owner_for_id: number;
    wallet: string;
}
