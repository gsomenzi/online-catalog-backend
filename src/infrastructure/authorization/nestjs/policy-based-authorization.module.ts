import { type DynamicModule, Global, Module, type Provider, type Type } from "@nestjs/common";
import type { AuthorizationPolicy } from "../domain/ports/authorization-policy";
import { PolicyBasedAuthorizationService } from "../infrastructure/policy-based-authorization-service";

export const AUTHZ_SERVICE = Symbol("AUTHZ_SERVICE");

export interface PolicyBasedAuthorizationModuleOptions {
    policies: Type<AuthorizationPolicy>[];
}

@Global()
@Module({})
export class PolicyBasedAuthorizationModule {
    static forRoot(options: PolicyBasedAuthorizationModuleOptions): DynamicModule {
        const authorizationServiceProvider: Provider = {
            provide: AUTHZ_SERVICE,
            useFactory: (...policies: AuthorizationPolicy[]) => {
                const service = new PolicyBasedAuthorizationService();

                for (const policy of policies) {
                    service.registerPolicy(policy);
                }

                return service;
            },
            inject: options.policies,
        };

        return {
            module: PolicyBasedAuthorizationModule,
            providers: [...options.policies, authorizationServiceProvider],
            exports: [AUTHZ_SERVICE],
        };
    }
}
