import type { AuthorizationActions, AuthorizationContext } from "@infrastructure/authorization";
import { AuthorizationPolicy } from "@infrastructure/authorization";
import { Store } from "@/domain/entity/store.entity";

export class GetStoreAuthorizationPolicy extends AuthorizationPolicy<Store> {
    readonly resourceClass = Store;
    readonly action: AuthorizationActions = "read";

    can(context: AuthorizationContext<Store>) {
        const {
            user,
            target: { resource },
        } = context;

        if (!this.isOwner(resource, user)) {
            return this.deny("User does not own the store");
        }

        return this.allow();
    }
}
