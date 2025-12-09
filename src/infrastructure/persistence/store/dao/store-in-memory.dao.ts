import { Injectable } from "@nestjs/common";
import type { Specification } from "@persistence/specification.interface";
import { type CreateStoreRecordDTO, type StoreDAO, StoreRecord, type UpdateStoreRecordDTO } from "@persistence/store";

@Injectable()
class StoreInMemoryDAO implements StoreDAO {
    private stores: Map<string, StoreRecord> = new Map();

    async create(dto: CreateStoreRecordDTO): Promise<void> {
        const record = Object.assign(new StoreRecord(), dto);
        this.stores.set(record.id, record);
    }

    async update(id: string, dto: UpdateStoreRecordDTO): Promise<void> {
        const existing = this.stores.get(id);
        if (existing) {
            const updated = Object.assign(existing, dto);
            this.stores.set(id, updated);
        }
    }

    async delete(id: string): Promise<void> {
        const existing = this.stores.get(id);
        if (existing) {
            existing.deletedAt = new Date();
            this.stores.set(id, existing);
        }
    }

    async findOne(...specs: Specification<StoreRecord>[]): Promise<StoreRecord | null> {
        const stores = Array.from(this.stores.values());

        for (const store of stores) {
            let matches = true;
            for (const spec of specs) {
                if (!this.matchesSpecification(store, spec)) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                return store;
            }
        }

        return null;
    }

    async findMany(...specs: Specification<StoreRecord>[]): Promise<StoreRecord[]> {
        const stores = Array.from(this.stores.values());

        return stores.filter((store) => {
            for (const spec of specs) {
                if (!this.matchesSpecification(store, spec)) {
                    return false;
                }
            }
            return true;
        });
    }

    clear(): void {
        this.stores.clear();
    }

    private matchesSpecification(store: StoreRecord, spec: Specification<StoreRecord>): boolean {
        const specName = spec.constructor.name;

        if (specName === "StoreActiveSpecification") {
            return store.deletedAt === null || store.deletedAt === undefined;
        }

        if (specName === "StoreByIdSpecification") {
            const idSpec = spec as unknown as { id: string };
            return store.id === idSpec.id;
        }

        if (specName === "StoreFromUserSpecification") {
            const userSpec = spec as unknown as { userId: string };
            return store.userId === userSpec.userId;
        }

        return true;
    }
}

export { StoreInMemoryDAO };
