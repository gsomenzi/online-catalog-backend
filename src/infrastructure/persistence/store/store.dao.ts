import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Specification } from "../specification.interface";
import { CreateStoreRecordDTO, UpdateStoreRecordDTO } from "./dto";
import { StoreRecord } from "./store.record";

@Injectable()
class StoreDAO {
    constructor(private readonly dataSource: DataSource) {}

    async create(dto: CreateStoreRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().insert().into(StoreRecord).values(dto).execute();
    }

    async update(id: string, dto: UpdateStoreRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().update(StoreRecord).set(dto).where("id = :id", { id }).execute();
    }

    async delete(id: string): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .update(StoreRecord)
            .set({ deletedAt: new Date() })
            .where("id = :id", { id })
            .execute();
    }

    async findOne(...specs: Specification<StoreRecord>[]): Promise<StoreRecord | null> {
        let qb = this.dataSource.createQueryBuilder().select("store").from(StoreRecord, "store");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return (await qb.getOne()) || null;
    }

    async findMany(...specs: Specification<StoreRecord>[]): Promise<StoreRecord[]> {
        let qb = this.dataSource.createQueryBuilder().select("store").from(StoreRecord, "store");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return await qb.getMany();
    }
}

export { StoreDAO };
