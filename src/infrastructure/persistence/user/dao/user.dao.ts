import type { Specification } from "@/infrastructure/persistence/specification.interface";
import type { CreateUserRecordDTO, UpdateUserRecordDTO, UserRecord } from "@/infrastructure/persistence/user";

export interface UserDAO {
    create(dto: CreateUserRecordDTO): Promise<void>;
    update(id: string, dto: UpdateUserRecordDTO): Promise<void>;
    delete(id: string): Promise<void>;
    findOne(...specs: Specification<UserRecord>[]): Promise<UserRecord | null>;
    findMany(...specs: Specification<UserRecord>[]): Promise<UserRecord[]>;
}

export const USER_DAO_TOKEN = Symbol("USER_DAO_TOKEN");
