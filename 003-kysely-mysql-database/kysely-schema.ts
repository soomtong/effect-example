import type { Generated } from 'kysely';

export class UserEntity {
    constructor(public readonly id: number, public readonly site: string, public readonly username: string) { }
}

export interface UserTable {
    id: Generated<number>;
    site: string;
    username: string;
}

export interface DatabaseSchema {
    user: UserTable;
}
