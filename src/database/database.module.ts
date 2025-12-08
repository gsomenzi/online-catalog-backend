import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./data-source";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...databaseConfig,
            autoLoadEntities: true, // Carrega entities dos módulos automaticamente
        }),
    ],
})
export class DatabaseModule {}
