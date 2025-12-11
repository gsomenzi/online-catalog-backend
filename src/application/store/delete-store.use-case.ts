import { Inject, Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { AUTHZ_SERVICE, type AuthorizationService, AuthorizationUser } from "@/infrastructure/authorization";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class DeleteStoreUseCase {
    constructor(
        @Inject(AUTHZ_SERVICE) private authorizationService: AuthorizationService,
        private storeRepository: StoreRepository
    ) {}
    async execute(storeId: string, user: AuthorizationUser): Promise<void> {
        const store = await this.storeRepository.findById(storeId);
        const authResult = await this.authorizationService.authorize(user, "delete", store);
        if (!store || !authResult.isAllowed) {
            throw new ObjectNotFoundException();
        }
        await this.storeRepository.delete(storeId);
    }
}
