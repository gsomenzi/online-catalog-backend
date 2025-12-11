import type { AuthorizationUser } from "./authorization-user";

export type AuthorizationActions = "create" | "read" | "update" | "delete";

export interface AuthorizationContext<RESOURCE, USER = AuthorizationUser> {
    user: USER;
    target: {
        action: AuthorizationActions;
        resource: RESOURCE;
    };
}
