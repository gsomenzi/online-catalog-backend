import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpRequest {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
