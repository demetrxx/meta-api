import { type PrismaClient } from '@prisma/client';

import topics from '../data/topics';

export async function loadTopics(prisma: PrismaClient): Promise<void> {
  const data = topics.map((topic, idx) => ({
    order: idx + 1,
    name: topic,
  }));

  await prisma.historyTopic.createMany({ data });
}
