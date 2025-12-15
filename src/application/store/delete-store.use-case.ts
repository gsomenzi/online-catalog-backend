import { AuthorizationActions, type AuthorizationService } from "@gsomenzi/policy-based-authorization-system";
import { AUTHZ_SERVICE } from "@gsomenzi/policy-based-authorization-system/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { AuthorizationUser } from "@/domain/value_object/auth/authenticated-request";
import { StoreRepository } from "@/infrastructure/persistence/store";

const { DELETE } = AuthorizationActions;

@Injectable()
export class DeleteStoreUseCase {
    constructor(
        @Inject(AUTHZ_SERVICE) private authorizationService: AuthorizationService,
        private storeRepository: StoreRepository
    ) {}
    async execute(storeId: string, user: AuthorizationUser): Promise<void> {
        const store = await this.storeRepository.findById(storeId);
        const authResult = await this.authorizationService.authorize(user, DELETE, store);
        if (!store || !authResult.isAllowed) {
            throw new ObjectNotFoundException();
        }
        await this.storeRepository.delete(storeId);
    }
}
