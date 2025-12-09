import type {
    CreateProductRecordDTO,
    ProductRecord,
    UpdateProductRecordDTO,
} from "@/infrastructure/persistence/product";
import type { Specification } from "@/infrastructure/persistence/specification.interface";

export interface ProductDAO {
    create(dto: CreateProductRecordDTO): Promise<void>;
    update(id: string, dto: UpdateProductRecordDTO): Promise<void>;
    delete(id: string): Promise<void>;
    findOne(...specs: Specification<ProductRecord>[]): Promise<ProductRecord | null>;
    findMany(...specs: Specification<ProductRecord>[]): Promise<ProductRecord[]>;
}

export const PRODUCT_DAO_TOKEN = Symbol("PRODUCT_DAO_TOKEN");
