import { loadRoutes } from '@/shared/system';

import { google } from './google/google';
import { token } from './token/token';

export const authRoutes = loadRoutes([token, google], { prefix: '/auth' });
