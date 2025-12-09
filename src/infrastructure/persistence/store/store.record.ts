import { Store } from "@domain/entity/store.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserRecord } from "../user";

@Entity("stores")
class StoreRecord {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ name: "user_id" })
    userId: string;

    @ManyToOne(() => UserRecord)
    @JoinColumn({ name: "user_id" })
    user?: UserRecord;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    static fromEntity(entity: Store): StoreRecord {
        const record = new StoreRecord();
        record.id = entity.id;
        record.name = entity.name;
        record.userId = entity.userId;
        record.createdAt = entity.createdAt;
        record.updatedAt = entity.updatedAt;
        record.deletedAt = entity.deletedAt;
        return record;
    }

    static toEntity(record: StoreRecord): Store {
        const storeProps = {
            id: record.id,
            name: record.name,
            userId: record.userId,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
            user: record.user ? UserRecord.toEntity(record.user) : undefined,
        };
        return new Store(storeProps);
    }
}

export { StoreRecord };
