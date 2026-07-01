import type { Quote } from '../types'

const SEED_QUOTES: Omit<Quote, 'bid' | 'ask' | 'last' | 'change' | 'changePercent' | 'volume'>[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
]

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100
}

export function createInitialQuotes(): Quote[] {
  return SEED_QUOTES.map((seed) => {
    const last = roundPrice(randomBetween(80, 450))
    const spread = roundPrice(randomBetween(0.02, 0.15))
    const change = roundPrice(randomBetween(-5, 5))
    const changePercent = roundPrice((change / last) * 100)

    return {
      ...seed,
      last,
      bid: roundPrice(last - spread / 2),
      ask: roundPrice(last + spread / 2),
      change,
      changePercent,
      volume: Math.floor(randomBetween(500_000, 8_000_000)),
    }
  })
}

export function tickQuote(quote: Quote): Quote {
  const delta = roundPrice(randomBetween(-0.8, 0.8))
  const last = roundPrice(Math.max(1, quote.last + delta))
  const spread = roundPrice(randomBetween(0.02, 0.15))
  const change = roundPrice(quote.change + delta)
  const changePercent = roundPrice((change / (last - change)) * 100)

  return {
    ...quote,
    last,
    bid: roundPrice(last - spread / 2),
    ask: roundPrice(last + spread / 2),
    change,
    changePercent,
    volume: quote.volume + Math.floor(randomBetween(100, 5000)),
  }
}

export function getQuoteSymbols(quotes: Quote[]): string[] {
  return quotes.map((quote) => quote.symbol)
}
