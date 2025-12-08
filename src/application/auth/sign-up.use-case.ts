import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "@persistence/user";
import { User } from "@/domain/entity/user.entity";
import { SignUpRequest } from "@/domain/value_object/auth/sign-up-request";

@Injectable()
export class SignUpUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(dto: SignUpRequest): Promise<User> {
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
