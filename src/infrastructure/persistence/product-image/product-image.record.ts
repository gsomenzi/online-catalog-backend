import { ProductImage } from "@domain/entity/product-image.entity";
import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("product_images")
export class ProductImageRecord {
    @PrimaryColumn()
    id: string;

    @PrimaryColumn({ name: "product_id" })
    productId: string;

    @PrimaryColumn({ name: "file_path" })
    filePath: string;

    @PrimaryColumn({ name: "file_name" })
    fileName: string;

    @PrimaryColumn({ name: "mime_type" })
    mimeType: string;

    @PrimaryColumn()
    size: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    static fromEntity(entity: ProductImage): ProductImageRecord {
        const record = new ProductImageRecord();
        record.id = entity.id;
        record.productId = entity.productId;
        record.filePath = entity.filePath;
        record.fileName = entity.fileName;
        record.mimeType = entity.mimeType;
        record.size = entity.size;
        record.createdAt = entity.createdAt;
        return record;
    }

    toEntity(): ProductImage {
        return new ProductImage({
            id: this.id,
            productId: this.productId,
            filePath: this.filePath,
            fileName: this.fileName,
            mimeType: this.mimeType,
            size: this.size,
            createdAt: this.createdAt,
        });
    }
}
