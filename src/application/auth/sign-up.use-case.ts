import { User } from "@domain/entity/user.entity";
import { EmailAlreadyInUseException } from "@domain/exception/auth";
import { PasswordService } from "@domain/service/password.service";
import { SignUpRequest } from "@domain/value_object/auth/sign-up-request";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "@persistence/user";

@Injectable()
export class SignUpUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(dto: SignUpRequest): Promise<User> {
        const { name, email, password } = dto;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new EmailAlreadyInUseException(email);
        }
        const user = User.create({ name, email });
        const hashedPassword = await PasswordService.hash(password);
        await this.userRepository.create(user, hashedPassword);
        return user;
    }
}
