export function getIdsArr(items?: Array<{ id: number }>): number[] {
  return items?.map((i) => i.id) ?? [];
}
