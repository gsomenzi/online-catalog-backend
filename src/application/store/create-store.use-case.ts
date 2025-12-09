import { Store } from "@domain/entity/store.entity";
import { CreateStoreRequest } from "@domain/value_object/store/create-store-request";
import { Injectable } from "@nestjs/common";
import { StoreRepository } from "@persistence/store";

@Injectable()
export class CreateStoreUseCase {
    constructor(private storeRepository: StoreRepository) {}
    async execute(dto: CreateStoreRequest, userId: string): Promise<Store> {
        const store = Store.create({
            name: dto.name,
            userId: userId,
        });
        await this.storeRepository.create(store);
        return store;
    }
}
