import { Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class DeleteStoreUseCase {
    constructor(private storeRepository: StoreRepository) {}
    async execute(storeId: string, userId: string): Promise<void> {
        const store = await this.storeRepository.findUserStoreById(userId, storeId);
        if (!store || store.userId !== userId) {
            throw new ObjectNotFoundException();
        }
        await this.storeRepository.delete(storeId);
    }
}
