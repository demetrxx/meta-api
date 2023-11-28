import { type FastifyInstance } from 'fastify';

import { UserService } from '@/modules/user';
import { loadRoutes } from '@/shared/system';

import { changeRoles } from './changeRoles/changeRoles';
import { changeStatus } from './changeStatus/changeStatus';
import { deleteById } from './deleteById/deleteById';
import { getByEmail } from './getByEmail/getByEmail';
import { getMany } from './getMany/getMany';

export const userRoutes = loadRoutes({
  routes: [getByEmail, getMany, changeStatus, changeRoles, deleteById],
  opts: { prefix: '/user' },
  decorators: { userService: (fastify: FastifyInstance) => new UserService(fastify) },
  adminsOnly: true,
});
