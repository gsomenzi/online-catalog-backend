export class AuthorizationResult {
    constructor(
        public readonly isAllowed: boolean,
        public readonly reason?: string
    ) {}

    static allow(): AuthorizationResult {
        return new AuthorizationResult(true);
    }

    static deny(reason: string): AuthorizationResult {
        return new AuthorizationResult(false, reason);
    }
}
