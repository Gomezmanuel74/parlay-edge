import type { LinkCapability, SportsbookId } from '../types'

export const BOOK_CAPABILITY: Record<SportsbookId, LinkCapability> = {
  draftkings: 'event_link',
  fanduel: 'event_link',
  caesars: 'event_link',
  fanatics: 'app_only',
  hardrock: 'app_only',
  thescore: 'unsupported',
}

export const BOOK_HOME: Record<SportsbookId, string> = {
  draftkings: 'https://sportsbook.draftkings.com/',
  fanduel: 'https://sportsbook.fanduel.com/',
  caesars: 'https://www.caesars.com/sportsbook-and-casino',
  fanatics: 'https://sportsbook.fanatics.com/',
  hardrock: 'https://www.hardrock.bet/',
  thescore: 'https://www.thescore.bet/',
}

export function handoffAction(capability: LinkCapability): {
  primary: string
  secondary?: string
  note: string
} {
  switch (capability) {
    case 'full_betslip':
      return {
        primary: 'Open betslip',
        note: 'Selections are preloaded. Confirm the live line inside the sportsbook before you bet.',
      }
    case 'market_link':
      return {
        primary: 'Open market',
        secondary: 'Copy betslip',
        note: 'The market will open. You still have to enter each selection yourself.',
      }
    case 'event_link':
      return {
        primary: 'Open event',
        secondary: 'Copy betslip',
        note: 'Opens the game page. Enter the listed selections and confirm the current line.',
      }
    case 'app_only':
      return {
        primary: 'Open sportsbook',
        secondary: 'Copy betslip',
        note: 'No documented betslip deep link. Copy the slip and enter it in the app.',
      }
    default:
      return {
        primary: 'Copy betslip',
        secondary: 'Open sportsbook',
        note: 'No reliable documented link exists for this book.',
      }
  }
}

export function formatBetslipText(
  legs: { selection: string; market: string; game: string; americanOdds: number }[],
): string {
  return legs
    .map((l) => `${l.game} | ${l.market} | ${l.selection} | ${l.americanOdds > 0 ? '+' : ''}${l.americanOdds}`)
    .join('\n')
}
