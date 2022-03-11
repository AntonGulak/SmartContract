import { Type } from './type.contract';
import { CommandContract } from './command.contract';

export const method = {
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE',
} as const;

type Keys = keyof typeof method;
type Method = typeof method[Keys];

export interface Route {
    method: Method;
    path: string;
    command: Type<CommandContract>;
}
