import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "@persistence/user";
import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "@/domain/entity/user.entity";

export class SignUpDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

@Injectable()
export class SignUpUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(dto: SignUpDTO): Promise<User> {
        const { name, email, password } = dto;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already in use");
        }
        const user = await User.create({ name, email, password });
        await this.userRepository.create(user);
        return user;
    }
}
