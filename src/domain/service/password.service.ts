class PasswordService {
    static async hash(plainPassword: string): Promise<string> {
        return Bun.password.hash(plainPassword, {
            algorithm: "bcrypt",
            cost: 10,
        });
    }

    static async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return Bun.password.verify(plainPassword, hashedPassword);
    }
}

export { PasswordService };
