import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
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
