import { DomainException } from "../domain.exception";

export class EmailAlreadyInUseException extends DomainException {
    readonly i18nKey = "errors.auth.emailAlreadyInUse";
    readonly statusCode = 400;

    constructor(email?: string) {
        super("Email already in use", { email });
    }
}
