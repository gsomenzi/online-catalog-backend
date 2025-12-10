import { Store } from "@domain/entity/store.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import type { ProductRecord } from "../product";
import { UserRecord } from "../user";

@Entity("stores")
export class StoreRecord {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ name: "user_id" })
    userId: string;

    @ManyToOne("UserRecord")
    @JoinColumn({ name: "user_id" })
    user?: UserRecord;

    @OneToMany("ProductRecord", (product: ProductRecord) => product.store)
    products?: ProductRecord[];

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

    toEntity(): Store {
        return new Store({
            id: this.id,
            name: this.name,
            userId: this.userId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            products: this.products?.map((product) => product.toEntity()),
        });
    }
}
