import { clamp } from './odds'

export interface CorrelationPair {
  a: string
  b: string
  rho: number
}

export function independentProbability(probs: number[]): number {
  return probs.reduce((acc, p) => acc * p, 1)
}

export function correlationAdjustment(
  probs: number[],
  pairs: CorrelationPair[],
  ids?: string[],
): { raw: number; adjustment: number; final: number } {
  const raw = independentProbability(probs)
  if (probs.length < 2) return { raw, adjustment: 0, final: raw }

  let penalty = 0
  if (ids && pairs.length) {
    for (const pair of pairs) {
      const i = ids.indexOf(pair.a)
      const j = ids.indexOf(pair.b)
      if (i < 0 || j < 0) continue
      const shared = Math.min(probs[i], probs[j])
      penalty += Math.max(0, pair.rho) * 0.18 * shared
    }
  } else {
    const avg = pairs.length
      ? pairs.reduce((s, p) => s + Math.max(0, p.rho), 0) / pairs.length
      : 0.08
    penalty = avg * 0.12 * (probs.length - 1)
  }

  const factor = clamp(1 - penalty, 0.55, 1)
  const final = clamp(raw * factor, 0.001, 0.999)
  return { raw, adjustment: final - raw, final }
}
