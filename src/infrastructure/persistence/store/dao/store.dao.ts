import type { Specification } from "@/infrastructure/persistence/specification.interface";
import type { CreateStoreRecordDTO, StoreRecord, UpdateStoreRecordDTO } from "@/infrastructure/persistence/store";

export interface StoreDAO {
    create(dto: CreateStoreRecordDTO): Promise<void>;
    update(id: string, dto: UpdateStoreRecordDTO): Promise<void>;
    delete(id: string): Promise<void>;
    findOne(...specs: Specification<StoreRecord>[]): Promise<StoreRecord | null>;
    findMany(...specs: Specification<StoreRecord>[]): Promise<StoreRecord[]>;
}

export const STORE_DAO_TOKEN = Symbol("STORE_DAO_TOKEN");
