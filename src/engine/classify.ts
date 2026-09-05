import { edgePp } from './odds'
import type { SkepticResult, TierThresholds, Verdict } from '../types'

export function classifyMarket(opts: {
  modelProb: number
  fairProb: number
  uncertainty: number
  skeptic: SkepticResult
  minEdgePp?: number
}): Verdict {
  if (opts.skeptic === 'REJECT') return 'PASS'
  const edge = edgePp(opts.modelProb, opts.fairProb)
  const minEdge = opts.minEdgePp ?? 2.5
  if (edge < minEdge || opts.uncertainty >= 0.45) return 'PASS'
  if (opts.skeptic === 'CAUTION' || opts.uncertainty >= 0.28 || edge < minEdge + 1) {
    return edge >= minEdge ? 'LEAN' : 'PASS'
  }
  if (opts.modelProb >= 0.57 && edge >= minEdge) return 'BET'
  if (edge >= minEdge) return 'LEAN'
  return 'PASS'
}

export function qualifiesForTier(
  legs: { modelProb: number; edgePp: number; verdict: Verdict; skeptic: SkepticResult }[],
  thresholds: TierThresholds,
): { ok: boolean; reason?: string } {
  const usable = legs.filter(
    (l) =>
      l.verdict !== 'PASS' &&
      l.skeptic !== 'REJECT' &&
      l.modelProb >= thresholds.minIndividualProb &&
      l.edgePp >= thresholds.minEdgePp,
  )
  if (usable.length === 0) return { ok: false, reason: 'No qualifying legs' }
  return { ok: true }
}

export function neverPadLegs<T>(qualifying: T[], targetCount: number): T[] {
  return qualifying.slice(0, Math.max(1, Math.min(qualifying.length, targetCount + 2)))
}
