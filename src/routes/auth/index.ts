import { loadRoutes } from '@/shared/system';

import { google } from './google/google';
import { login } from './login/login';
import { register } from './register/register';
import { token } from './token/token';

export const authRoutes = loadRoutes([register, login, token, google], { prefix: '/auth' });
