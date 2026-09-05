/** Odds, vig, EV, and payout math. Stake never changes probability. */

export function americanToDecimal(american: number): number {
  if (american === 0) throw new Error('American odds cannot be 0')
  if (american > 0) return american / 100 + 1
  return 100 / Math.abs(american) + 1
}

export function decimalToAmerican(decimal: number): number {
  if (decimal <= 1) throw new Error('Decimal odds must be greater than 1')
  if (decimal >= 2) return Math.round((decimal - 1) * 100)
  return Math.round(-100 / (decimal - 1))
}

export function impliedProbability(american: number): number {
  if (american === 0) throw new Error('American odds cannot be 0')
  if (american > 0) return 100 / (american + 100)
  return Math.abs(american) / (Math.abs(american) + 100)
}

export function removeVigTwoWay(probA: number, probB: number): [number, number] {
  const total = probA + probB
  if (total <= 0) throw new Error('Implied probabilities must be positive')
  return [probA / total, probB / total]
}

export function removeVigMulti(probs: number[]): number[] {
  const total = probs.reduce((s, p) => s + p, 0)
  if (total <= 0) throw new Error('Implied probabilities must be positive')
  return probs.map((p) => p / total)
}

export function edgePp(modelProb: number, fairMarketProb: number): number {
  return (modelProb - fairMarketProb) * 100
}

export function expectedValue(modelProb: number, americanOdds: number, stake: number): number {
  const decimal = americanToDecimal(americanOdds)
  return stake * (modelProb * decimal - 1)
}

export function totalReturn(americanOdds: number, stake: number): number {
  return stake * americanToDecimal(americanOdds)
}

export function netProfit(americanOdds: number, stake: number): number {
  return totalReturn(americanOdds, stake) - stake
}

export function stakeForTargetProfit(americanOdds: number, targetProfit: number): number {
  const b = americanToDecimal(americanOdds) - 1
  if (b <= 0) throw new Error('Odds must pay a profit')
  return targetProfit / b
}

export function combineIndependentAmerican(legs: number[]): number {
  const decimal = legs.reduce((acc, a) => acc * americanToDecimal(a), 1)
  return decimalToAmerican(decimal)
}

export function formatAmerican(american: number): string {
  if (!american) return '--'
  return american > 0 ? `+${Math.round(american)}` : `${Math.round(american)}`
}

export function formatMoney(n: number): string {
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(n).toFixed(2)}`
}

export function formatPct(p: number, digits = 1): string {
  return `${(p * 100).toFixed(digits)}%`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function roundToIncrement(n: number, increment: number): number {
  return Math.round(n / increment) * increment
}
