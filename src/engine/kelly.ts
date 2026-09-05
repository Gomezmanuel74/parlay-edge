import { americanToDecimal, clamp, roundToIncrement } from './odds'

export function fractionalKelly(
  modelProb: number,
  americanOdds: number,
  bankroll: number,
  fraction = 0.25,
): number {
  const b = americanToDecimal(americanOdds) - 1
  if (b <= 0) return 0
  const edge = modelProb * (b + 1) - 1
  if (edge <= 0) return 0
  const full = edge / b
  return Math.max(0, bankroll * full * fraction)
}

export function recommendStakes(opts: {
  modelProb: number
  americanOdds: number
  bankroll: number
  uncertainty: number
  remainingBankroll: number
  increment?: number
}): { model: number; suggested: number; lower: number; maxPlan: number } {
  const increment = opts.increment ?? 5
  const raw = fractionalKelly(opts.modelProb, opts.americanOdds, opts.bankroll, 0.2)
  const uncertaintyHaircut = clamp(1 - opts.uncertainty * 0.7, 0.25, 1)
  const model = Math.min(opts.remainingBankroll, raw * uncertaintyHaircut)
  const cap = Math.min(opts.remainingBankroll, opts.bankroll * 0.4)
  const suggested = clamp(roundToIncrement(model, increment), 0, cap)
  const lower = Math.min(suggested, increment)
  const maxPlan = clamp(roundToIncrement(suggested + increment, increment), 0, cap)
  return {
    model: Math.round(model * 100) / 100,
    suggested,
    lower: suggested === 0 ? 0 : Math.max(increment, lower),
    maxPlan: Math.max(suggested, maxPlan),
  }
}
