import { useEffect, useState, type ReactNode } from 'react'
import { Activity, AlertTriangle, Check, ChevronDown, Copy, Database, Download, ExternalLink, FlaskConical, LayoutDashboard, Minus, Plus, Settings as SettingsIcon, ShieldAlert, SlidersHorizontal } from 'lucide-react'
import type { Allocation, ParlayCard } from './types'
import { demoCalibration, demoParlays, demoProviders, demoRecords, defaultAllocations, NOW } from './data/demo'
import { applyCapChange, DEFAULT_CONFIGURED_MAX, DEFAULT_WEEKEND_CAP, QUICK_STAKES, americanToDecimal, edgePp, expectedValue, formatAmerican, formatMoney, formatPct, incrementStake, netProfit, stakeForTargetProfit, totalReturn, unusedBankroll, formatBetslipText } from './engine'

type Tab = 'home' | 'allocate' | 'health' | 'results' | 'lab' | 'settings'
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
const LADDER = [5, 10, 15, 20, 25, 30, 40, 50]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [cap, setCap] = useState(DEFAULT_WEEKEND_CAP)
  const [approvedMax, setApprovedMax] = useState(DEFAULT_WEEKEND_CAP)
  const [pendingCap, setPendingCap] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<Allocation[]>(defaultAllocations)
  const [stakes, setStakes] = useState<Record<string, number>>(() => Object.fromEntries(demoParlays.map((p) => [p.id, p.recommendedStake])))
  const [openWhy, setOpenWhy] = useState<string | null>(null)
  const [targetProfit, setTargetProfit] = useState(100)
  const [targetId, setTargetId] = useState('nfl-cons')
  const [copied, setCopied] = useState<string | null>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [help, setHelp] = useState(false)

  useEffect(() => {
    setInstalled(window.matchMedia('(display-mode: standalone)').matches)
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BeforeInstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setInstallPrompt(null)
      return
    }
    setHelp(true)
  }

  const recommended = allocations.reduce((s, a) => s + a.amount, 0)
  const unused = unusedBankroll(cap, recommended)
  function requestCap(next: number) {
    const result = applyCapChange(approvedMax, next, DEFAULT_CONFIGURED_MAX)
    if (result.requiresAck) setPendingCap(result.next)
    else setCap(result.next)
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-24">
      <header className="sticky top-0 z-20 border-b border-[#1c3344] bg-[#071018]/92 backdrop-blur">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-[#d4b46a]">DECISION SUPPORT</p>
              <h1 className="text-xl font-semibold">Parlay Edge</h1>
            </div>
            {!installed && (
              <button onClick={() => void installApp()} className="flex items-center gap-1 rounded-full bg-[#3ecfbf] px-3 py-1 text-xs font-semibold text-[#071018]">
                <Download size={12} /> Install
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-[#8aa0ad]">DEMO DATA · {new Date(NOW).toLocaleString()}</p>
          {help && !installed && (
            <div className="mt-2 rounded-lg border border-[#3ecfbf]/30 bg-[#0d1a24] px-3 py-2 text-xs">
              <p className="font-medium text-[#3ecfbf]">Add this to your phone</p>
              <p className="mt-1">Android Chrome: menu, then Add to Home screen or Install app.</p>
              <p className="mt-1">iPhone Safari: Share, then Add to Home Screen.</p>
              <button className="mt-2 text-[#8aa0ad]" onClick={() => setHelp(false)}>Dismiss</button>
            </div>
          )}
        </div>
      </header>

      {tab === 'home' && (
        <main className="space-y-4 px-4 pt-4">
          <section className="rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4">
            <div className="flex justify-between"><p className="text-[11px] tracking-[0.18em] text-[#8aa0ad]">WEEKEND BANKROLL</p><p className="font-semibold">{formatMoney(cap)}</p></div>
            <input type="range" min={0} max={DEFAULT_CONFIGURED_MAX} step={5} value={cap} onChange={(e) => requestCap(Number(e.target.value))} className="mt-3 w-full" />
            <div className="mt-2 flex flex-wrap gap-1.5">{QUICK_STAKES.map((n) => <button key={n} onClick={() => requestCap(n)} className={`rounded-full px-2.5 py-1 text-xs ${cap === n ? 'bg-[#3ecfbf] text-[#071018]' : 'border border-[#1c3344]'}`}>${n}</button>)}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-[#071018] p-2">Cap {formatMoney(cap)}</div>
              <div className="rounded-lg bg-[#071018] p-2">Rec {formatMoney(recommended)}</div>
              <div className="rounded-lg bg-[#071018] p-2">Unused {formatMoney(Math.max(0, unused))}</div>
            </div>
            {recommended > cap && <p className="mt-2 flex items-center gap-1 text-xs text-[#e05a5a]"><AlertTriangle size={12} /> Over cap. Cards were not auto-changed.</p>}
          </section>
          <div className="flex gap-2 rounded-xl border border-[#3ecfbf]/25 bg-[#3ecfbf]/8 px-3 py-2 text-xs"><ShieldAlert size={16} className="text-[#3ecfbf]" /><p>Stake changes dollars only. Probability stays locked.</p></div>
          {(['NCAA', 'NFL'] as const).map((sport) => (
            <section key={sport} className="space-y-3">
              <h2 className="text-sm tracking-[0.2em] text-[#d4b46a]">{sport}</h2>
              {demoParlays.filter((p) => p.sport === sport).map((card) => (
                <Card key={card.id} card={card} stake={stakes[card.id] ?? 0} cap={cap} openWhy={openWhy} setOpenWhy={setOpenWhy} setStake={(id, n) => setStakes((p) => ({ ...p, [id]: Math.max(0, Math.min(cap, n)) }))} copied={copied} onCopy={() => { navigator.clipboard?.writeText(formatBetslipText(card.legs.map((l) => ({ selection: l.selection, market: l.market, game: l.game, americanOdds: l.americanOdds })))).catch(() => {}); setCopied(card.id); setTimeout(() => setCopied(null), 1500) }} />
              ))}
            </section>
          ))}
          <section className="rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4">
            <p className="text-[11px] tracking-[0.18em] text-[#8aa0ad]">CROSS-SPORT</p>
            <h2 className="mt-1 text-lg font-semibold">NO QUALIFYING CROSS-SPORT PARLAY</h2>
            <div className="mt-3 rounded-lg bg-[#071018] px-3 py-2 text-sm font-medium text-[#d4b46a]">PASS</div>
          </section>
          <Target cap={cap} targetProfit={targetProfit} setTargetProfit={setTargetProfit} targetId={targetId} setTargetId={setTargetId} />
        </main>
      )}
      {tab === 'allocate' && (
        <main className="space-y-3 px-4 pt-4">
          <h2 className="text-lg font-semibold">Weekend allocator</h2>
          {allocations.map((row) => (
            <div key={row.key} className="rounded-xl border border-[#1c3344] bg-[#0d1a24] p-3">
              <div className="flex justify-between text-sm"><span>{row.label}</span><span>${row.amount}</span></div>
              <input type="range" min={0} max={cap} step={5} value={row.amount} onChange={(e) => setAllocations(allocations.map((a) => a.key === row.key ? { ...a, amount: Number(e.target.value) } : a))} className="mt-2 w-full" />
            </div>
          ))}
        </main>
      )}
      {tab === 'health' && <main className="space-y-3 px-4 pt-4"><h2 className="text-lg font-semibold">Data health</h2>{demoProviders.map((p) => <div key={p.id} className="flex justify-between rounded-xl border border-[#1c3344] bg-[#0d1a24] px-3 py-3 text-sm"><span>{p.label}</span><span className="text-[#d4b46a]">{p.status}</span></div>)}</main>}
      {tab === 'results' && <main className="space-y-3 px-4 pt-4"><h2 className="text-lg font-semibold">Results</h2>{demoCalibration.map((b) => <div key={b.label} className="rounded-xl border border-[#1c3344] bg-[#0d1a24] px-3 py-3 text-sm">Predicted {b.label}: {b.sample ? formatPct(b.actualWinRate, 0) : 'n/a'} n={b.sample}</div>)}{demoRecords.map((r) => <div key={r.id} className="rounded-xl border border-[#1c3344] bg-[#0d1a24] px-3 py-3 text-xs">{r.sport} {r.recommendedLine} · {r.outcome}</div>)}</main>}
      {tab === 'lab' && <main className="px-4 pt-4 text-sm text-[#8aa0ad]"><h2 className="text-lg font-semibold text-white">Model lab</h2><p className="mt-2">Stake size never changes model probability or thresholds.</p></main>}
      {tab === 'settings' && <main className="px-4 pt-4 text-sm text-[#8aa0ad]"><h2 className="text-lg font-semibold text-white">Settings</h2><p className="mt-2">Demo mode. No API keys required.</p></main>}
      {pendingCap != null && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60 p-4">
          <div className="w-full rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4">
            <p className="font-semibold">Raise weekend budget?</p>
            <p className="mt-2 text-sm text-[#8aa0ad]">More stake means more profit and more loss. It does not raise win probability.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setPendingCap(null)} className="rounded-xl border border-[#1c3344] py-3 text-sm">Cancel</button>
              <button onClick={() => { setApprovedMax(pendingCap); setCap(pendingCap); setPendingCap(null) }} className="rounded-xl bg-[#3ecfbf] py-3 text-sm font-semibold text-[#071018]">I understand</button>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#1c3344] bg-[#071018]/95">
        <div className="mx-auto grid max-w-lg grid-cols-6 text-[10px] text-[#8aa0ad]">
          <Nav icon={<LayoutDashboard size={16} />} label="Home" active={tab==='home'} onClick={() => setTab('home')} />
          <Nav icon={<SlidersHorizontal size={16} />} label="Alloc" active={tab==='allocate'} onClick={() => setTab('allocate')} />
          <Nav icon={<Database size={16} />} label="Health" active={tab==='health'} onClick={() => setTab('health')} />
          <Nav icon={<Activity size={16} />} label="Results" active={tab==='results'} onClick={() => setTab('results')} />
          <Nav icon={<FlaskConical size={16} />} label="Lab" active={tab==='lab'} onClick={() => setTab('lab')} />
          <Nav icon={<SettingsIcon size={16} />} label="Settings" active={tab==='settings'} onClick={() => setTab('settings')} />
        </div>
      </nav>
    </div>
  )
}

function Nav({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex flex-col items-center gap-1 py-2 ${active ? 'text-[#3ecfbf]' : ''}`}>{icon}{label}</button>
}

function Card({ card, stake, cap, openWhy, setOpenWhy, setStake, copied, onCopy }: { card: ParlayCard; stake: number; cap: number; openWhy: string | null; setOpenWhy: (id: string | null) => void; setStake: (id: string, n: number) => void; copied: string | null; onCopy: () => void }) {
  if (card.status === 'PASS') {
    return <article className="rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4"><div className="flex justify-between"><h3 className="font-semibold">{card.tier}</h3><span className="text-xs text-[#d4b46a]">PASS / NO BET</span></div><p className="mt-2 text-sm text-[#8aa0ad]">{card.passReason}</p></article>
  }
  const payout = totalReturn(card.combinedAmericanOdds, stake)
  const profit = netProfit(card.combinedAmericanOdds, stake)
  return (
    <article className="rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4">
      <div className="flex justify-between"><div><h3 className="font-semibold">{card.tier}</h3><p className="text-xs text-[#8aa0ad]">{card.legs.length} legs</p></div><p className="text-lg font-semibold">{formatAmerican(card.combinedAmericanOdds)}</p></div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[#071018] p-2"><p className="text-[#8aa0ad]">Win probability</p><p className="text-base font-semibold text-[#3ecfbf]">{formatPct(card.finalProbability)}</p><p>Locked</p></div>
        <div className="rounded-lg bg-[#071018] p-2"><p className="text-[#8aa0ad]">If this stake hits</p><p className="text-base font-semibold">{formatMoney(payout)}</p><p>Net {formatMoney(profit)}</p></div>
      </div>
      {card.legs.map((leg) => (
        <div key={leg.id} className="mt-2 rounded-xl border border-[#1c3344] p-3">
          <p className="text-sm font-medium">{leg.selection}</p>
          <p className="text-xs text-[#8aa0ad]">{leg.game} · Model {formatPct(leg.modelProbability)} · Edge +{edgePp(leg.modelProbability, leg.fairMarketProbability).toFixed(1)} pp</p>
          {leg.quotes.map((q) => <div key={q.book} className="flex justify-between text-[11px] text-[#8aa0ad]"><span>{q.label}</span><span>{formatAmerican(q.americanOdds)}</span></div>)}
          <button onClick={() => setOpenWhy(openWhy === leg.id ? null : leg.id)} className="mt-2 flex items-center gap-1 text-xs text-[#3ecfbf]">Why this pick? <ChevronDown size={14} /></button>
          {openWhy === leg.id && <ul className="mt-2 list-disc pl-4 text-xs">{leg.positives.map((f) => <li key={f.text}>{f.text}</li>)}</ul>}
        </div>
      ))}
      <p className="mt-4 text-[11px] tracking-[0.16em] text-[#8aa0ad]">STAKE AND RETURN SIMULATOR</p>
      <div className="mt-2 flex items-center gap-2">
        <button className="rounded-lg border border-[#1c3344] p-2" onClick={() => setStake(card.id, incrementStake(stake, -5, cap))}><Minus size={16} /></button>
        <input type="number" value={stake} onChange={(e) => setStake(card.id, Number(e.target.value) || 0)} className="w-full rounded-lg border border-[#1c3344] bg-[#071018] px-3 py-2 text-sm" />
        <button className="rounded-lg border border-[#1c3344] p-2" onClick={() => setStake(card.id, incrementStake(stake, 5, cap))}><Plus size={16} /></button>
      </div>
      <input type="range" min={0} max={cap} step={5} value={Math.min(stake, cap)} onChange={(e) => setStake(card.id, Number(e.target.value))} className="mt-2 w-full" />
      <p className="mt-2 text-xs">EV {formatMoney(expectedValue(card.finalProbability, card.combinedAmericanOdds, stake))} · Decimal {americanToDecimal(card.combinedAmericanOdds).toFixed(2)}</p>
      <div className="mt-3 divide-y divide-[#1c3344] rounded-xl border border-[#1c3344]">{LADDER.filter((n) => n <= Math.max(cap, 25)).map((n) => <button key={n} onClick={() => setStake(card.id, Math.min(n, cap))} className="flex w-full justify-between px-3 py-2 text-xs"><span>${n}</span><span>{formatMoney(totalReturn(card.combinedAmericanOdds, n))} / {formatMoney(netProfit(card.combinedAmericanOdds, n))} profit</span></button>)}</div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href="https://sportsbook.draftkings.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 rounded-xl bg-[#3ecfbf] py-3 text-sm font-semibold text-[#071018]">Open DraftKings <ExternalLink size={14} /></a>
        <button onClick={onCopy} className="flex items-center justify-center gap-1 rounded-xl border border-[#1c3344] py-3 text-sm">{copied === card.id ? <Check size={14} /> : <Copy size={14} />}{copied === card.id ? 'Copied' : 'Copy slip'}</button>
      </div>
    </article>
  )
}

function Target({ cap, targetProfit, setTargetProfit, targetId, setTargetId }: { cap: number; targetProfit: number; setTargetProfit: (n: number) => void; targetId: string; setTargetId: (id: string) => void }) {
  const cards = demoParlays.filter((p) => p.status === 'QUALIFIED')
  const card = cards.find((c) => c.id === targetId) ?? cards[0]
  const required = card ? stakeForTargetProfit(card.combinedAmericanOdds, targetProfit) : 0
  return (
    <section className="rounded-2xl border border-[#1c3344] bg-[#0d1a24] p-4">
      <p className="text-[11px] tracking-[0.18em] text-[#8aa0ad]">WHAT WOULD IT TAKE TO WIN $X?</p>
      <select value={card?.id} onChange={(e) => setTargetId(e.target.value)} className="mt-3 w-full rounded-lg border border-[#1c3344] bg-[#071018] px-3 py-2 text-sm">{cards.map((c) => <option key={c.id} value={c.id}>{c.sport} {c.tier}</option>)}</select>
      <div className="mt-2 flex gap-1.5">{[50, 100, 250, 500].map((n) => <button key={n} onClick={() => setTargetProfit(n)} className={`rounded-full px-2.5 py-1 text-xs ${targetProfit === n ? 'bg-[#3ecfbf] text-[#071018]' : 'border border-[#1c3344]'}`}>${n}</button>)}</div>
      {card && <div className="mt-3 rounded-lg bg-[#071018] p-3 text-sm"><p>Required stake {formatMoney(required)}</p><p className="text-xs text-[#8aa0ad]">Probability stays {formatPct(card.finalProbability)}.</p>{required > cap && <p className="mt-2 text-xs text-[#e05a5a]">TARGET EXCEEDS CURRENT BANKROLL LIMIT</p>}</div>}
    </section>
  )
}
