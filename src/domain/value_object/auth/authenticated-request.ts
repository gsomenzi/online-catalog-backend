import { Request } from "express";

export type AuthorizationUser = {
    id: string;
    email: string;
};

export type AuthenticatedRequest = Request & {
    user: AuthorizationUser;
};
