export type Sport = 'NFL' | 'NCAA'
export type ParlayTier = 'Conservative' | 'Balanced' | 'Higher Return'
export type Verdict = 'BET' | 'LEAN' | 'PASS'
export type SkepticResult = 'APPROVED' | 'CAUTION' | 'REJECT'
export type DataStatus = 'LIVE' | 'STALE' | 'ERROR' | 'NOT CONFIGURED' | 'DEMO'
export type LinkCapability =
  | 'full_betslip'
  | 'market_link'
  | 'event_link'
  | 'app_only'
  | 'unsupported'

export type SportsbookId =
  | 'draftkings'
  | 'fanduel'
  | 'caesars'
  | 'fanatics'
  | 'hardrock'
  | 'thescore'

export interface BookQuote {
  book: SportsbookId
  label: string
  americanOdds: number
  line?: number | string
  lastChecked: string
  capability: LinkCapability
  url?: string
}

export interface Factor {
  text: string
}

export interface Leg {
  id: string
  sport: Sport
  game: string
  kickoff: string
  market: string
  selection: string
  modelProbability: number
  fairMarketProbability: number
  americanOdds: number
  line?: string
  uncertainty: number
  confidence: number
  dataFreshness: string
  skeptic: SkepticResult
  verdict: Verdict
  positives: Factor[]
  risks: Factor[]
  quotes: BookQuote[]
  correlatedWith?: string[]
}

export interface ParlayCard {
  id: string
  sport: Sport | 'CROSS'
  tier: ParlayTier | 'Cross-Sport'
  legs: Leg[]
  rawIndependentProbability: number
  correlationAdjustment: number
  finalProbability: number
  combinedAmericanOdds: number
  recommendedStake: number
  lowerStake: number
  maxPlanStake: number
  skeptic: SkepticResult
  status: 'QUALIFIED' | 'PASS'
  passReason?: string
  lastAnalyzed: string
}

export interface Allocation {
  key: string
  label: string
  sport: Sport | 'CROSS'
  amount: number
}

export interface ProviderHealth {
  id: string
  label: string
  status: DataStatus
  updatedAt: string
  note?: string
}

export interface RecommendationRecord {
  id: string
  timestamp: string
  sport: Sport | 'CROSS'
  game: string
  market: string
  sportsbook: string
  recommendedLine: string
  odds: number
  modelProbability: number
  fairMarketProbability: number
  edge: number
  ev: number
  confidence: number
  uncertainty: number
  stakeRecommendation: number
  actualStake?: number
  closingLine?: string
  outcome?: 'WIN' | 'LOSS' | 'PUSH' | 'PENDING'
}

export interface CalibrationBucket {
  label: string
  predictedMin: number
  predictedMax: number
  actualWinRate: number
  sample: number
}

export interface AppSettings {
  liveMode: boolean
  jurisdiction: string
  lineMoveTolerancePp: number
  conservative: TierThresholds
  balanced: TierThresholds
  higherReturn: TierThresholds
  crossSport: CrossSportThresholds
}

export interface TierThresholds {
  targetLegs: number
  minIndividualProb: number
  minEdgePp: number
  minAdjustedParlayProb?: number
}

export interface CrossSportThresholds {
  minIndividualProb: number
  minEdgePp: number
  minCombinedProb: number
  requireLowUncertainty: boolean
}
