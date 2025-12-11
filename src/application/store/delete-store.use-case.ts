import { Inject, Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { AUTHORIZATION_SERVICE, type AuthorizationService, AuthorizationUser } from "@/infrastructure/authorization";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class DeleteStoreUseCase {
    constructor(
        @Inject(AUTHORIZATION_SERVICE) private authorizationService: AuthorizationService,
        private storeRepository: StoreRepository
    ) {}
    async execute(storeId: string, user: AuthorizationUser): Promise<void> {
        const store = await this.storeRepository.findById(storeId);
        if (!store) {
            throw new ObjectNotFoundException();
        }
        const authResult = await this.authorizationService.authorize(user, "delete", store);
        if (!store || !authResult.isAllowed) {
            throw new ObjectNotFoundException();
        }
        await this.storeRepository.delete(storeId);
    }
}
