export function calcTimePassed({
  prevTimePassed,
  lastViewed,
}: {
  prevTimePassed: number;
  lastViewed: Date;
}): number {
  const now = Date.now();
  return prevTimePassed + (now - lastViewed.getTime());
}
