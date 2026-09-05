import type { Allocation, AppSettings, CalibrationBucket, ParlayCard, ProviderHealth, RecommendationRecord } from '../types'

export const NOW = '2026-09-05T10:00:00-04:00'

export const defaultSettings: AppSettings = {
  liveMode: false,
  jurisdiction: 'MI',
  lineMoveTolerancePp: 3,
  conservative: { targetLegs: 2, minIndividualProb: 0.62, minEdgePp: 3, minAdjustedParlayProb: 0.4 },
  balanced: { targetLegs: 3, minIndividualProb: 0.57, minEdgePp: 3, minAdjustedParlayProb: 0.22 },
  higherReturn: { targetLegs: 4, minIndividualProb: 0.53, minEdgePp: 2.5 },
  crossSport: { minIndividualProb: 0.68, minEdgePp: 4, minCombinedProb: 0.45, requireLowUncertainty: true },
}

const q = (book: 'draftkings' | 'fanduel' | 'caesars', label: string, americanOdds: number) => ({
  book, label, americanOdds, lastChecked: NOW, capability: 'event_link' as const,
  url: book === 'fanduel' ? 'https://sportsbook.fanduel.com/' : book === 'caesars' ? 'https://www.caesars.com/sportsbook-and-casino' : 'https://sportsbook.draftkings.com/',
})

export const demoParlays: ParlayCard[] = [
  {
    id: 'ncaa-cons', sport: 'NCAA', tier: 'Conservative', status: 'QUALIFIED', lastAnalyzed: NOW,
    rawIndependentProbability: 0.446, correlationAdjustment: -0.018, finalProbability: 0.428,
    combinedAmericanOdds: 210, recommendedStake: 15, lowerStake: 5, maxPlanStake: 20, skeptic: 'APPROVED',
    legs: [
      {
        id: 'ncaa-1', sport: 'NCAA', game: 'Oregon @ Ohio State', kickoff: NOW, market: 'Spread', selection: 'Ohio State -6.5',
        modelProbability: 0.671, fairMarketProbability: 0.628, americanOdds: -168, line: '-6.5', uncertainty: 0.16, confidence: 0.74,
        dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'BET',
        positives: [{ text: 'OSU opponent-adjusted defensive EPA ranks top-8' }, { text: 'Market still 4.3 pp below model' }],
        risks: [{ text: 'Early-season sample' }],
        quotes: [q('draftkings','DraftKings',-175), q('fanduel','FanDuel',-168), q('caesars','Caesars',-172)],
      },
      {
        id: 'ncaa-2', sport: 'NCAA', game: 'Penn State @ Michigan', kickoff: NOW, market: 'Moneyline', selection: 'Michigan ML',
        modelProbability: 0.664, fairMarketProbability: 0.631, americanOdds: -162, uncertainty: 0.18, confidence: 0.71,
        dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'BET',
        positives: [{ text: 'Verified LT question mark for Penn State' }],
        risks: [{ text: 'Rivalry variance' }],
        quotes: [q('draftkings','DraftKings',-170), q('fanduel','FanDuel',-162)],
      },
    ],
  },
  {
    id: 'ncaa-bal', sport: 'NCAA', tier: 'Balanced', status: 'QUALIFIED', lastAnalyzed: NOW,
    rawIndependentProbability: 0.251, correlationAdjustment: -0.021, finalProbability: 0.23,
    combinedAmericanOdds: 365, recommendedStake: 5, lowerStake: 5, maxPlanStake: 10, skeptic: 'CAUTION',
    legs: [
      { id: 'ncaa-b1', sport: 'NCAA', game: 'Texas A&M @ LSU', kickoff: NOW, market: 'Spread', selection: 'LSU -3.5', modelProbability: 0.602, fairMarketProbability: 0.568, americanOdds: -128, line: '-3.5', uncertainty: 0.22, confidence: 0.64, dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'LEAN', positives: [{ text: 'LSU havoc rate' }], risks: [{ text: 'One-possession script' }], quotes: [q('draftkings','DraftKings',-135), q('fanduel','FanDuel',-128)] },
      { id: 'ncaa-b2', sport: 'NCAA', game: 'USC @ Notre Dame', kickoff: NOW, market: 'Total', selection: 'Under 51.5', modelProbability: 0.581, fairMarketProbability: 0.548, americanOdds: -120, line: 'U51.5', uncertainty: 0.24, confidence: 0.61, dataFreshness: NOW, skeptic: 'CAUTION', verdict: 'LEAN', positives: [{ text: 'Explosive-play suppression' }], risks: [{ text: 'Wind is moderate, not decisive' }], quotes: [q('draftkings','DraftKings',-115), q('fanduel','FanDuel',-120)] },
      { id: 'ncaa-b3', sport: 'NCAA', game: 'Alabama @ Georgia', kickoff: NOW, market: 'Team total', selection: 'Georgia team over 24.5', modelProbability: 0.574, fairMarketProbability: 0.541, americanOdds: -115, line: 'O24.5', uncertainty: 0.21, confidence: 0.62, dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'LEAN', positives: [{ text: 'Georgia red-zone success' }], risks: [{ text: 'SEC clustering' }], quotes: [q('draftkings','DraftKings',-120), q('fanduel','FanDuel',-115)] },
    ],
  },
  { id: 'ncaa-hr', sport: 'NCAA', tier: 'Higher Return', status: 'PASS', passReason: 'Only two NCAA legs clear Higher Return filters. No extra legs were manufactured.', lastAnalyzed: NOW, rawIndependentProbability: 0, correlationAdjustment: 0, finalProbability: 0, combinedAmericanOdds: 0, recommendedStake: 0, lowerStake: 0, maxPlanStake: 0, skeptic: 'REJECT', legs: [] },
  {
    id: 'nfl-cons', sport: 'NFL', tier: 'Conservative', status: 'QUALIFIED', lastAnalyzed: NOW,
    rawIndependentProbability: 0.452, correlationAdjustment: -0.012, finalProbability: 0.44,
    combinedAmericanOdds: 198, recommendedStake: 15, lowerStake: 5, maxPlanStake: 20, skeptic: 'APPROVED',
    legs: [
      {
        id: 'nfl-1', sport: 'NFL', game: 'Lions @ Packers', kickoff: NOW, market: 'Moneyline', selection: 'Detroit Lions ML',
        modelProbability: 0.718, fairMarketProbability: 0.645, americanOdds: -168, uncertainty: 0.14, confidence: 0.78,
        dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'BET',
        positives: [{ text: 'DET opponent-adjusted EPA' }, { text: 'Indoor conditions' }, { text: 'Best price still +7.3 pp edge' }],
        risks: [{ text: 'Pass rush still a plus unit' }, { text: 'Market moved 0.5 points' }],
        quotes: [q('draftkings','DraftKings',-175), q('fanduel','FanDuel',-168), q('caesars','Caesars',-172)],
      },
      {
        id: 'nfl-2', sport: 'NFL', game: 'Bills @ Jets', kickoff: NOW, market: 'Spread', selection: 'Buffalo -6',
        modelProbability: 0.629, fairMarketProbability: 0.592, americanOdds: -122, line: '-6', uncertainty: 0.17, confidence: 0.7,
        dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'BET',
        positives: [{ text: 'Jets OL injuries are verified' }],
        risks: [{ text: 'Meadowlands wind can clip kicks' }],
        quotes: [q('draftkings','DraftKings',-130), q('fanduel','FanDuel',-122)],
      },
    ],
  },
  {
    id: 'nfl-bal', sport: 'NFL', tier: 'Balanced', status: 'QUALIFIED', lastAnalyzed: NOW,
    rawIndependentProbability: 0.248, correlationAdjustment: -0.016, finalProbability: 0.232,
    combinedAmericanOdds: 380, recommendedStake: 5, lowerStake: 5, maxPlanStake: 10, skeptic: 'APPROVED',
    legs: [
      { id: 'nfl-b1', sport: 'NFL', game: 'Chiefs @ Chargers', kickoff: NOW, market: 'Spread', selection: 'Kansas City -3', modelProbability: 0.598, fairMarketProbability: 0.561, americanOdds: -125, line: '-3', uncertainty: 0.2, confidence: 0.66, dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'LEAN', positives: [{ text: 'KC efficiency after luck strip' }], risks: [{ text: 'Short week' }], quotes: [q('draftkings','DraftKings',-130), q('fanduel','FanDuel',-125)] },
      { id: 'nfl-b2', sport: 'NFL', game: 'Eagles @ Cowboys', kickoff: NOW, market: 'Moneyline', selection: 'Philadelphia Eagles ML', modelProbability: 0.611, fairMarketProbability: 0.574, americanOdds: -135, uncertainty: 0.19, confidence: 0.67, dataFreshness: NOW, skeptic: 'APPROVED', verdict: 'BET', positives: [{ text: 'PHI trench grades' }], risks: [{ text: 'Division game' }], quotes: [q('draftkings','DraftKings',-142), q('fanduel','FanDuel',-135)] },
      { id: 'nfl-b3', sport: 'NFL', game: 'Ravens @ Bengals', kickoff: NOW, market: 'Team total', selection: 'Baltimore team over 23.5', modelProbability: 0.572, fairMarketProbability: 0.539, americanOdds: -110, line: 'O23.5', uncertainty: 0.23, confidence: 0.6, dataFreshness: NOW, skeptic: 'CAUTION', verdict: 'LEAN', positives: [{ text: 'BAL red-zone EPA' }], risks: [{ text: 'Home scoring environment' }], quotes: [q('draftkings','DraftKings',-115), q('fanduel','FanDuel',-110)] },
    ],
  },
  { id: 'nfl-hr', sport: 'NFL', tier: 'Higher Return', status: 'PASS', passReason: 'Adding a 4th NFL leg would require dipping below filters. PASS is correct.', lastAnalyzed: NOW, rawIndependentProbability: 0, correlationAdjustment: 0, finalProbability: 0, combinedAmericanOdds: 0, recommendedStake: 0, lowerStake: 0, maxPlanStake: 0, skeptic: 'REJECT', legs: [] },
  { id: 'cross', sport: 'CROSS', tier: 'Cross-Sport', status: 'PASS', passReason: 'NO QUALIFYING CROSS-SPORT PARLAY. Thresholds not met. PASS.', lastAnalyzed: NOW, rawIndependentProbability: 0, correlationAdjustment: 0, finalProbability: 0, combinedAmericanOdds: 0, recommendedStake: 0, lowerStake: 0, maxPlanStake: 0, skeptic: 'REJECT', legs: [] },
]

export const defaultAllocations: Allocation[] = [
  { key: 'ncaa-cons', label: 'NCAA Conservative', sport: 'NCAA', amount: 15 },
  { key: 'ncaa-bal', label: 'NCAA Balanced', sport: 'NCAA', amount: 5 },
  { key: 'ncaa-hr', label: 'NCAA Higher Return', sport: 'NCAA', amount: 0 },
  { key: 'nfl-cons', label: 'NFL Conservative', sport: 'NFL', amount: 15 },
  { key: 'nfl-bal', label: 'NFL Balanced', sport: 'NFL', amount: 5 },
  { key: 'nfl-hr', label: 'NFL Higher Return', sport: 'NFL', amount: 0 },
  { key: 'cross', label: 'Cross-Sport', sport: 'CROSS', amount: 0 },
]

export const demoProviders: ProviderHealth[] = [
  { id: 'odds', label: 'Odds Provider', status: 'DEMO', updatedAt: NOW },
  { id: 'nfl-stats', label: 'NFL Stats', status: 'DEMO', updatedAt: NOW },
  { id: 'ncaa-stats', label: 'NCAA Stats', status: 'DEMO', updatedAt: NOW },
  { id: 'weather', label: 'Weather', status: 'DEMO', updatedAt: NOW },
  { id: 'news', label: 'News', status: 'DEMO', updatedAt: NOW },
  { id: 'injuries', label: 'Injuries', status: 'DEMO', updatedAt: NOW },
  { id: 'draftkings', label: 'DraftKings', status: 'DEMO', updatedAt: NOW },
  { id: 'fanduel', label: 'FanDuel', status: 'DEMO', updatedAt: NOW },
  { id: 'caesars', label: 'Caesars', status: 'DEMO', updatedAt: NOW },
  { id: 'fanatics', label: 'Fanatics', status: 'NOT CONFIGURED', updatedAt: NOW },
]

export const demoRecords: RecommendationRecord[] = [
  { id: 'r1', timestamp: NOW, sport: 'NFL', game: 'Archive', market: 'ML', sportsbook: 'FanDuel', recommendedLine: 'DET ML', odds: -150, modelProbability: 0.64, fairMarketProbability: 0.59, edge: 5, ev: 4.2, confidence: 0.7, uncertainty: 0.2, stakeRecommendation: 10, actualStake: 10, outcome: 'WIN' },
  { id: 'r2', timestamp: NOW, sport: 'NCAA', game: 'Archive', market: 'Spread', sportsbook: 'DraftKings', recommendedLine: 'Home -3.5', odds: -110, modelProbability: 0.58, fairMarketProbability: 0.54, edge: 4, ev: 2.1, confidence: 0.62, uncertainty: 0.24, stakeRecommendation: 10, actualStake: 10, outcome: 'LOSS' },
]

export const demoCalibration: CalibrationBucket[] = [
  { label: '50-59%', predictedMin: 0.5, predictedMax: 0.59, actualWinRate: 0.52, sample: 18 },
  { label: '60-69%', predictedMin: 0.6, predictedMax: 0.69, actualWinRate: 0.61, sample: 11 },
  { label: '70-79%', predictedMin: 0.7, predictedMax: 0.79, actualWinRate: 0.67, sample: 6 },
  { label: '80%+', predictedMin: 0.8, predictedMax: 1, actualWinRate: 0, sample: 0 },
]
