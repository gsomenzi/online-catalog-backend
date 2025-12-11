import { getResourceType } from "../decorators/authorizable.decorator";
import type { AuthorizationActions, AuthorizationContext } from "../value-objects/authorization-context";
import { AuthorizationResult } from "../value-objects/authorization-result";
import type { AuthorizationUser } from "../value-objects/authorization-user";

export abstract class AuthorizationPolicy<RESOURCE extends object = object> {
    abstract readonly resourceClass: new (
        // biome-ignore lint/suspicious/noExplicitAny: can be any constructor
        ...args: any[]
    ) => RESOURCE;
    abstract readonly action: AuthorizationActions;

    private _resourceType?: string;

    abstract can(
        context: AuthorizationContext<RESOURCE, AuthorizationUser>
    ): Promise<AuthorizationResult> | AuthorizationResult;

    get resourceType(): string {
        if (!this._resourceType) {
            const type = getResourceType(this.resourceClass);
            if (!type) {
                throw new Error(
                    `Resource class ${this.resourceClass.name} is not decorated with @Authorizable("resourceType")`
                );
            }
            this._resourceType = type;
        }
        return this._resourceType;
    }

    protected allow(): AuthorizationResult {
        return AuthorizationResult.allow();
    }

    protected deny(reason: string): AuthorizationResult {
        return AuthorizationResult.deny(reason);
    }

    protected isOwner(resource: { userId: string }, user: AuthorizationUser): boolean {
        return resource.userId === user.id;
    }
}
