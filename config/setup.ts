import * as fsp from 'node:fs/promises';

import { type FastifyInstance } from 'fastify';
const setupFlagPath = './setup-flag.txt';

async function isSetupCompleted(): Promise<boolean> {
  try {
    // Check if the setup flag or file exists
    await fsp.access(setupFlagPath);
    return true;
  } catch (error) {
    // The file does not exist, setup is not completed
    return false;
  }
}

async function markSetupAsCompleted(): Promise<void> {
  // Create an empty setup flag or file
  await fsp.writeFile(setupFlagPath, '');
}

export async function setup(app: FastifyInstance): Promise<void> {
  try {
    // Check if setup has already been completed
    const setupCompleted = await isSetupCompleted();

    if (setupCompleted) {
      console.log('Setup has already been completed. Skipping.');
      return;
    }

    // Create the initial admin profile
    const adminUser = await app.prisma.user.create({
      data: {
        email: app.env.OWNER_EMAIL,
        roles: ['USER', 'ADMIN', 'OWNER'],
      },
    });

    console.log('Initial admin profile created:', adminUser);

    // Mark setup as completed
    await markSetupAsCompleted();
  } catch (error) {
    console.error('Error during setup:', error);
  }
}
