import { AuthorizationActions, type AuthorizationService } from "@gsomenzi/policy-based-authorization-system";
import { AUTHZ_SERVICE } from "@gsomenzi/policy-based-authorization-system/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { AuthorizationUser } from "@/domain/value_object/auth/authenticated-request";
import { StoreRepository } from "@/infrastructure/persistence/store";

const { READ } = AuthorizationActions;

@Injectable()
export class GetStoreUseCase {
    constructor(
        @Inject(AUTHZ_SERVICE) private authorizationService: AuthorizationService,
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(id: string, user: AuthorizationUser) {
        const store = await this.storeRepository.findById(id);
        const { isAllowed } = await this.authorizationService.authorize(user, READ, store);
        if (!isAllowed) {
            throw new ObjectNotFoundException();
        }
        return store;
    }
}
