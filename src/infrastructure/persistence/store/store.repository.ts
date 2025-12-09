import { Inject, Injectable } from "@nestjs/common";
import { Store } from "@/domain/entity/store.entity";
import type { StoreDAO } from "./dao/store.dao";
import { STORE_DAO_TOKEN } from "./dao/store.dao";
import { StoreActiveSpecification } from "./specifications/store-active.specification";
import { StoreByIdSpecification } from "./specifications/store-by-id.specification";
import { StoreFromUserSpecification } from "./specifications/store-from-user.specification";
import { StoreRecord } from "./store.record";

@Injectable()
class StoreRepository {
    constructor(@Inject(STORE_DAO_TOKEN) private readonly storeDAO: StoreDAO) {}

    async create(store: Store): Promise<void> {
        const record = StoreRecord.fromEntity(store);
        await this.storeDAO.create(record);
    }

    async update(store: Store): Promise<void> {
        const record = StoreRecord.fromEntity(store);
        await this.storeDAO.update(store.id, record);
    }

    async delete(id: string): Promise<void> {
        await this.storeDAO.delete(id);
    }

    async findById(id: string): Promise<Store | null> {
        const record = await this.storeDAO.findOne(new StoreByIdSpecification(id), new StoreActiveSpecification());
        return record ? StoreRecord.toEntity(record) : null;
    }

    async findUserStoreById(userId: string, storeId: string): Promise<Store | null> {
        const record = await this.storeDAO.findOne(
            new StoreByIdSpecification(storeId),
            new StoreFromUserSpecification(userId),
            new StoreActiveSpecification()
        );
        return record ? StoreRecord.toEntity(record) : null;
    }

    async findAll(userId: string): Promise<Store[]> {
        const records = await this.storeDAO.findMany(
            new StoreFromUserSpecification(userId),
            new StoreActiveSpecification()
        );
        return records.map(StoreRecord.toEntity);
    }
}

export { StoreRepository };
