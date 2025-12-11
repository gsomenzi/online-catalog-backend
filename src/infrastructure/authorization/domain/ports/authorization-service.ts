import type { AuthorizationActions } from "../value-objects/authorization-context";
import type { AuthorizationResult } from "../value-objects/authorization-result";
import type { AuthorizationUser } from "../value-objects/authorization-user";
import type { AuthorizationPolicy } from "./authorization-policy";

export interface AuthorizationService {
    authorize<RESOURCE extends object>(
        user: AuthorizationUser,
        action: AuthorizationActions,
        resource: RESOURCE | null
    ): Promise<AuthorizationResult>;
    registerPolicy(policy: AuthorizationPolicy): void;
    getPolicy(action: string, resourceType: string): AuthorizationPolicy | undefined;
}
