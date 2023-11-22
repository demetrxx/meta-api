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
