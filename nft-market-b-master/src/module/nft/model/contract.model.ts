import { ContractType } from '../type/contract.type';

export interface ContractModel {
    id: number;
    type: ContractType;
    tvc_base64: string;
    abi: object;
    created_at: string;
    updated_at: string;
    code_hash: string;
}
