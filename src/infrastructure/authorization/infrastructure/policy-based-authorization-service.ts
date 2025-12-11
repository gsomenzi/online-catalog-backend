import { getResourceType } from "../domain/decorators/authorizable.decorator";
import type { AuthorizationPolicy } from "../domain/ports/authorization-policy";
import type { AuthorizationService } from "../domain/ports/authorization-service";
import type { AuthorizationActions, AuthorizationContext } from "../domain/value-objects/authorization-context";
import { AuthorizationResult } from "../domain/value-objects/authorization-result";
import type { AuthorizationUser } from "../domain/value-objects/authorization-user";

export class PolicyBasedAuthorizationService implements AuthorizationService {
    private policies: Map<string, AuthorizationPolicy> = new Map();

    async authorize<RESOURCE extends object>(
        user: AuthorizationUser,
        action: AuthorizationActions,
        resource: RESOURCE | null
    ): Promise<AuthorizationResult> {
        if (!resource) {
            return AuthorizationResult.deny("Resource not found");
        }

        const resourceType = getResourceType(resource);

        if (!resourceType) {
            throw new Error(
                `Resource type not found. Make sure the resource class is decorated with @Authorizable("resourceType")`
            );
        }

        const policyKey = `${resourceType}:${action}`;
        const policy = this.policies.get(policyKey);

        if (policy) {
            const context: AuthorizationContext<RESOURCE> = {
                user,
                target: { action, resource },
            };
            return policy.can(context);
        }

        return AuthorizationResult.allow();
    }

    registerPolicy(policy: AuthorizationPolicy): void {
        const policyKey = this.getPolicyKey(policy.resourceType, policy.action);
        this.policies.set(policyKey, policy);
    }

    getPolicy(action: string, resourceType: string): AuthorizationPolicy | undefined {
        const policyKey = this.getPolicyKey(resourceType, action);
        return this.policies.get(policyKey);
    }

    private getPolicyKey(resourceType: string, action: string): string {
        return `${resourceType}:${action}`;
    }
}
