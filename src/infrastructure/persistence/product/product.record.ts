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
import { Product } from "@/domain/entity/product.entity";
import { StoreRecord } from "../store";

@Entity("products")
export class ProductRecord {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column("decimal")
    price: number;

    @Column({ name: "store_id" })
    storeId: string;

    @ManyToOne(() => StoreRecord)
    @JoinColumn({ name: "store_id" })
    store?: StoreRecord;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    static fromEntity(entity: Product): ProductRecord {
        const record = new ProductRecord();
        record.id = entity.id;
        record.name = entity.name;
        record.description = entity.description;
        record.price = entity.price;
        record.storeId = entity.storeId;
        record.createdAt = entity.createdAt;
        record.updatedAt = entity.updatedAt;
        record.deletedAt = entity.deletedAt;
        return record;
    }

    static toEntity(record: ProductRecord): Product {
        return new Product({
            id: record.id,
            name: record.name,
            description: record.description,
            price: record.price,
            storeId: record.storeId,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
            store: record.store ? StoreRecord.toEntity(record.store) : undefined,
        });
    }
}
