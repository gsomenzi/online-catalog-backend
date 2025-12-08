import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { Specification } from "@/infrastructure/persistence/specification.interface";
import { CreateUserRecordDTO } from "@/infrastructure/persistence/user/dto/create-user-record.dto";
import { UpdateUserRecordDTO } from "@/infrastructure/persistence/user/dto/update-user-record.dto";
import { UserRecord } from "@/infrastructure/persistence/user/user.record";

@Injectable()
class UserDAO {
    constructor(private readonly dataSource: DataSource) {}

    async create(dto: CreateUserRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().insert().into(UserRecord).values(dto).execute();
    }

    async update(id: string, dto: UpdateUserRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().update(UserRecord).set(dto).where("id = :id", { id }).execute();
    }

    async delete(id: string): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .update(UserRecord)
            .set({ deletedAt: new Date() })
            .where("id = :id", { id })
            .execute();
    }

    async findOne(...specs: Specification<UserRecord>[]): Promise<UserRecord | null> {
        let qb = this.dataSource.createQueryBuilder().select("user").from(UserRecord, "user");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return (await qb.getOne()) || null;
    }

    async findMany(...specs: Specification<UserRecord>[]): Promise<UserRecord[]> {
        let qb = this.dataSource.createQueryBuilder().select("user").from(UserRecord, "user");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return await qb.getMany();
    }
}

export { UserDAO };
