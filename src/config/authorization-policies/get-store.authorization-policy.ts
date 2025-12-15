import {
    AuthorizationActions,
    type AuthorizationContext,
    ResourceAuthorizationPolicy,
} from "@gsomenzi/policy-based-authorization-system";
import { Store } from "@/domain/entity/store.entity";
import { User } from "@/domain/entity/user.entity";

export class GetStoreAuthorizationPolicy extends ResourceAuthorizationPolicy<User, Store> {
    readonly resourceClass = Store;
    readonly action: AuthorizationActions = AuthorizationActions.READ;

    authorize(context: AuthorizationContext<User, Store>) {
        const { user, resource } = context;

        if (user.id === resource.userId) {
            return this.allow();
        }
        return this.deny("User does not own the store");
    }
}
