import { type User } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

import { errMsg } from '@/shared/consts/errMsg';
import { getPagination } from '@/shared/lib';

declare module 'fastify' {
  interface FastifyInstance {
    userService: UserService;
  }
}

export class UserService {
  db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async getMany({ page, limit }: Pagination): Promise<User[]> {
    return await this.db.user.findMany(getPagination({ page, limit }));
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) throw new Error(errMsg.invalidEmail);
    return user;
  }

  async changeRoles(id: number, roles: User['roles']): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { roles: { set: roles } },
    });
  }

  async changeStatus(id: number, accountStatus: User['accountStatus']): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { accountStatus },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}
