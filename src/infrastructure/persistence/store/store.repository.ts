import { Injectable } from "@nestjs/common";
import { Store } from "@/domain/entity/store.entity";
import { StoreActiveSpecification } from "./specifications/store-active.specification";
import { StoreByIdSpecification } from "./specifications/store-by-id.specification";
import { StoreWithUserSpecification } from "./specifications/store-with-user.specification";
import { StoreDAO } from "./store.dao";
import { StoreRecord } from "./store.record";

@Injectable()
class StoreRepository {
    constructor(private readonly storeDAO: StoreDAO) {}

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

    async findAll(): Promise<Store[]> {
        const records = await this.storeDAO.findMany(new StoreActiveSpecification());
        return records.map(StoreRecord.toEntity);
    }

    async findAllWithUser(): Promise<Store[]> {
        const records = await this.storeDAO.findMany(new StoreActiveSpecification(), new StoreWithUserSpecification());
        return records.map(StoreRecord.toEntity);
    }

    async findByIdWithUser(id: string): Promise<Store | null> {
        const record = await this.storeDAO.findOne(
            new StoreByIdSpecification(id),
            new StoreActiveSpecification(),
            new StoreWithUserSpecification()
        );
        return record ? StoreRecord.toEntity(record) : null;
    }
}

export { StoreRepository };
