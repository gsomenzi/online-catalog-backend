import { IsEmail, IsNotEmpty } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class SignUpRequest {
    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    name: string;

    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    @IsEmail({}, { message: i18nValidationMessage("validation.isEmail") })
    email: string;

    @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
    password: string;
}
