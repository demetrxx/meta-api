import { type FastifyRequest } from 'fastify';

export function getIdsArr(items?: Array<{ id: number }>): number[] {
  return items?.map((i) => i.id) ?? [];
}

export function toIdsObjArr(items: number[]): Array<{ id: number }> {
  return items.map((id) => ({ id }));
}

export const selectId = { select: { id: true } } as const;

export async function timeOut(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPagination({ page, limit }: Pagination): {
  take?: number;
  skip?: number;
} {
  if (!page || !limit) return {};

  return { take: limit, skip: (page - 1) * limit };
}

export function isPublicRoute(request: FastifyRequest): boolean {
  return request.routeOptions.url.includes('public');
}
