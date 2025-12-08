export abstract class DomainException extends Error {
    abstract readonly i18nKey: string;
    abstract readonly statusCode: number;
    readonly args?: Record<string, unknown>;

    constructor(message: string, args?: Record<string, unknown>) {
        super(message);
        this.args = args;
        this.name = this.constructor.name;
    }
}
