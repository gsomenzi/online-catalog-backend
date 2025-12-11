import "reflect-metadata";
import { DomainExceptionFilter } from "@infrastructure/filter";
import { ClassSerializerInterceptor, VersioningType } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { I18nService, I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new I18nValidationPipe({
            transform: true,
        })
    );
    app.useGlobalFilters(
        new DomainExceptionFilter(app.get(I18nService)),
        new I18nValidationExceptionFilter({
            detailedErrors: true,
        })
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.enableVersioning({
        type: VersioningType.HEADER,
        header: "X-API-VERSION",
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
