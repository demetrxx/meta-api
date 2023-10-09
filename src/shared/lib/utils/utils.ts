export function getIdsArr(items?: Array<{ id: number }>): number[] {
  return items?.map((i) => i.id) ?? [];
}

export function toIdsObjArr(items: number[]): Array<{ id: number }> {
  return items.map((id) => ({ id }));
}
