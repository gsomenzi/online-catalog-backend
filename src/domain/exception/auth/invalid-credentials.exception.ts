import { DomainException } from "../domain.exception";

export class InvalidCredentialsException extends DomainException {
    readonly i18nKey = "errors.auth.invalidCredentials";
    readonly statusCode = 401;

    constructor() {
        super("Invalid credentials");
    }
}
