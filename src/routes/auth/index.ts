import { loadRoutes } from '@/shared/system';

import { google } from './google/google';
import { token } from './token/token';

export const authRoutes = loadRoutes({
  routes: [token, google],
  opts: { prefix: '/auth' },
});
