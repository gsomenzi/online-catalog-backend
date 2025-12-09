import { DomainException } from "../domain.exception";

export class StoreNotFoundException extends DomainException {
    readonly i18nKey = "errors.store.storeNotFound";
    readonly statusCode = 422;

    constructor() {
        super("Store not found");
    }
}
