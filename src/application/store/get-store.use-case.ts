import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { AUTHORIZATION_SERVICE, type AuthorizationService, AuthorizationUser } from "@/infrastructure/authorization";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class GetStoreUseCase {
    constructor(
        @Inject(AUTHORIZATION_SERVICE) private authorizationService: AuthorizationService,
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(id: string, user: AuthorizationUser) {
        const store = await this.storeRepository.findById(id);
        const { isAllowed, reason } = await this.authorizationService.authorize(user, "read", store);

        if (!isAllowed) {
            throw new ForbiddenException(reason || "Access to the store is forbidden.");
        }

        return store;
    }
}
