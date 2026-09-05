import { clamp, impliedProbability, roundToIncrement } from './odds'

export const DEFAULT_WEEKEND_CAP = 50
export const DEFAULT_CONFIGURED_MAX = 250
export const QUICK_STAKES = [5, 10, 15, 20, 25, 30, 40, 50]

export function bankrollSteps(max: number): number[] {
  const steps: number[] = []
  for (let n = 0; n <= Math.min(100, max); n += 5) steps.push(n)
  for (let n = 110; n <= max; n += 10) steps.push(n)
  if (!steps.includes(max)) steps.push(max)
  return steps
}

export function applyCapChange(
  currentApproved: number,
  requested: number,
  configuredMax: number,
): { next: number; requiresAck: boolean } {
  const next = clamp(roundToIncrement(requested, 5), 0, configuredMax)
  return { next, requiresAck: next > currentApproved }
}

export function unusedBankroll(cap: number, recommendedTotal: number): number {
  return Math.max(0, cap - recommendedTotal)
}

export function allocationTotal(amounts: number[]): number {
  return amounts.reduce((s, n) => s + n, 0)
}

export function exceedsBankroll(cap: number, amounts: number[]): boolean {
  return allocationTotal(amounts) > cap
}

export function incrementStake(current: number, delta: number, cap: number): number {
  return clamp(roundToIncrement(current + delta, 5), 0, cap)
}

export function lineMovedBeyondTolerance(
  analyzedAmerican: number,
  liveAmerican: number,
  tolerancePp: number,
): boolean {
  const a = impliedProbability(analyzedAmerican)
  const b = impliedProbability(liveAmerican)
  return Math.abs(a - b) * 100 > tolerancePp
}
