import { AccountType, UserRole } from "../../model/user.model";

export interface MeResponseDto {
    id: number;
    username: string;
    avatar?: string;
    token_expire_at: string;
    account_type: AccountType;
    role: UserRole;
    owner_for_id?: number;
}