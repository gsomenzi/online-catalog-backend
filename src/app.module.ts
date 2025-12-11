import path from "node:path";
import { AuthModule } from "@application/auth/auth.module";
import { DatabaseModule } from "@config/database/database.module";
import { PolicyBasedAuthorizationModule } from "@infrastructure/authorization";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PersistenceModule } from "@persistence/persistence.module";
import { RestApiModule } from "@presentation/rest-api/rest-api.module";
import { HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { GetStoreAuthorizationPolicy } from "@/config/authorization-policies/get-store.authorization-policy";
import { ProductModule } from "./application/product/product.module";
import { StoreModule } from "./application/store/store.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PolicyBasedAuthorizationModule.forRoot({
            policies: [GetStoreAuthorizationPolicy],
        }),
        AuthModule,
        DatabaseModule,
        PersistenceModule,
        RestApiModule,
        I18nModule.forRoot({
            fallbackLanguage: "pt-br",
            loaderOptions: {
                path: path.join(__dirname, "/config/i18n/"),
                watch: true,
            },
            resolvers: [{ use: QueryResolver, options: ["lang"] }, new HeaderResolver(["x-lang"])],
        }),
        StoreModule,
        ProductModule,
    ],
})
export class AppModule {}
