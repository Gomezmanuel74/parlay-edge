import { describe, expect, it } from 'vitest'
import { americanToDecimal, expectedValue, netProfit, stakeForTargetProfit, totalReturn } from './odds'
import { applyCapChange, unusedBankroll } from './bankroll'

describe('money rules', () => {
  it('return ladder', () => {
    expect(totalReturn(425, 5)).toBeCloseTo(26.25, 6)
    expect(netProfit(425, 5)).toBeCloseTo(21.25, 6)
  })
  it('target profit does not change odds', () => {
    expect(stakeForTargetProfit(400, 100)).toBeCloseTo(25, 6)
  })
  it('stake never changes probability', () => {
    const p = 0.42
    expect(expectedValue(p, 425, 10) / expectedValue(p, 425, 5)).toBeCloseTo(2, 8)
    expect(americanToDecimal(425)).toBeCloseTo(5.25, 6)
  })
  it('bankroll is a ceiling', () => {
    expect(unusedBankroll(50, 25)).toBe(25)
    expect(applyCapChange(50, 75, 250)).toEqual({ next: 75, requiresAck: true })
  })
})
