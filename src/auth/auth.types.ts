import type { Request } from 'express';
import { Role } from './roles.enum';

export type JwtUser = {
  userId: number;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user: JwtUser;
};
