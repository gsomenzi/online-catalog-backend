import { type ArgumentsHost, Catch, type ExceptionFilter } from "@nestjs/common";
import type { Response } from "express";
import { I18nService } from "nestjs-i18n";
import { DomainException } from "@/domain/exception/domain.exception";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) {}

    async catch(exception: DomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const lang = request.headers["x-lang"] || request.query.lang;
        const message = await this.i18n.t(exception.i18nKey, {
            args: exception.args,
            lang,
        });

        response.status(exception.statusCode).json({
            statusCode: exception.statusCode,
            message,
            error: exception.name,
        });
    }
}
