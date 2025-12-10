import { Injectable } from "@nestjs/common";
import {
    type CreateProductRecordDTO,
    type ProductDAO,
    ProductRecord,
    type UpdateProductRecordDTO,
} from "@persistence/product";
import type { Specification } from "@persistence/specification.interface";
import { type StoreInMemoryDAO, StoreRecord } from "@persistence/store";

@Injectable()
class ProductInMemoryDAO implements ProductDAO {
    private products: Map<string, ProductRecord> = new Map();

    constructor(private storeDAO?: StoreInMemoryDAO) {}
    async create(dto: CreateProductRecordDTO): Promise<void> {
        const record = Object.assign(new ProductRecord(), dto);
        this.products.set(record.id, record);
    }

    async update(id: string, dto: UpdateProductRecordDTO): Promise<void> {
        const existing = this.products.get(id);
        if (existing) {
            const updated = Object.assign(existing, dto);
            this.products.set(id, updated);
        }
    }

    async delete(id: string): Promise<void> {
        const existing = this.products.get(id);
        if (existing) {
            existing.deletedAt = new Date();
            this.products.set(id, existing);
        }
    }

    async findOne(...specs: Specification<ProductRecord>[]): Promise<ProductRecord | null> {
        const products = Array.from(this.products.values());

        for (const product of products) {
            let matches = true;
            for (const spec of specs) {
                if (!this.matchesSpecification(product, spec)) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                return product;
            }
        }

        return null;
    }

    async findMany(...specs: Specification<ProductRecord>[]): Promise<ProductRecord[]> {
        const products = Array.from(this.products.values());

        return products.filter((product) => {
            for (const spec of specs) {
                if (!this.matchesSpecification(product, spec)) {
                    return false;
                }
            }
            return true;
        });
    }

    clear(): void {
        this.products.clear();
    }

    private matchesSpecification(product: ProductRecord, spec: Specification<ProductRecord>): boolean {
        const specName = spec.constructor.name;

        if (specName === "ProductActiveSpecification") {
            return product.deletedAt === null || product.deletedAt === undefined;
        }

        if (specName === "ProductByIdSpecification") {
            const idSpec = spec as unknown as { id: string };
            return product.id === idSpec.id;
        }

        if (specName === "ProductFromStoreSpecification") {
            const storeSpec = spec as unknown as { storeId: string };
            return product.storeId === storeSpec.storeId;
        }

        if (specName === "ProductFromUserSpecification") {
            const userSpec = spec as unknown as { userId: string };
            if (this.storeDAO) {
                const stores = Array.from(this.storeDAO.stores.values() as IterableIterator<StoreRecord>);
                const store = stores.find((s: StoreRecord) => s.id === product.storeId);
                return store?.userId === userSpec.userId;
            }
            return false;
        }
        return true;
    }
}

export { ProductInMemoryDAO };
