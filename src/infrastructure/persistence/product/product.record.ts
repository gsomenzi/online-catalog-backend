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
import type { StoreRecord } from "../store";

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

    @ManyToOne("StoreRecord")
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

    toEntity(): Product {
        return new Product({
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            storeId: this.storeId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        });
    }
}
