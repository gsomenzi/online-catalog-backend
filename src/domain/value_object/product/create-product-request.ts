import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateProductRequest {
    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    name: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    @IsNumber(
        {
            allowInfinity: false,
            allowNaN: false,
            maxDecimalPlaces: 2,
        },
        { message: i18nValidationMessage("validation.isNumber") }
    )
    price: number;

    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    storeId: string;
}
