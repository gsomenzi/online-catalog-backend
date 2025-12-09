import { DomainException } from "../domain.exception";

export class ObjectNotFoundException extends DomainException {
    readonly i18nKey = "errors.common.objectNotFound";
    readonly statusCode = 404;

    constructor() {
        super("Object not found");
    }
}
