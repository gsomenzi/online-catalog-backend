import { Inject, Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { AUTHZ_SERVICE, type AuthorizationService, AuthorizationUser } from "@/infrastructure/authorization";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class GetStoreUseCase {
    constructor(
        @Inject(AUTHZ_SERVICE) private authorizationService: AuthorizationService,
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(id: string, user: AuthorizationUser) {
        const store = await this.storeRepository.findById(id);
        const { isAllowed } = await this.authorizationService.authorize(user, "read", store);
        if (!isAllowed) {
            throw new ObjectNotFoundException();
        }
        return store;
    }
}
