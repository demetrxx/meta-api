const GOAL = 50;
const FAILED_SHARE_RATIO = 0.5;

export function getThemeProgress({
  answered,
  failed,
}: {
  answered: number;
  failed: number;
}): number {
  let goalShare = answered / GOAL;
  if (goalShare > 1) goalShare = 1;

  let failedShare = (failed / GOAL) * FAILED_SHARE_RATIO;
  if (failedShare > goalShare) failedShare = goalShare;

  return Math.round((goalShare - failedShare) * 100);
}
