import { useMemo, useState, type FormEvent } from 'react'
import { useTrading } from '../context/TradingContext'
import type { OrderSide, OrderType } from '../types'
import { formatCurrency } from '../utils/formatters'
import './OrderEntry.css'

const DEFAULT_QUANTITY = 100

export function OrderEntry() {
  const { quotes, selectedSymbol, setSelectedSymbol, placeOrder } = useTrading()
  const [side, setSide] = useState<OrderSide>('BUY')
  const [type, setType] = useState<OrderType>('MARKET')
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)
  const [limitPrice, setLimitPrice] = useState('')
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(
    null,
  )

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.symbol === selectedSymbol),
    [quotes, selectedSymbol],
  )

  const estimatedPrice =
    selectedQuote && side === 'BUY' ? selectedQuote.ask : selectedQuote?.bid

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = placeOrder({
      symbol: selectedSymbol,
      side,
      type,
      quantity,
      limitPrice: type === 'LIMIT' ? Number(limitPrice) : undefined,
    })

    setFeedback({
      kind: result.success ? 'success' : 'error',
      message: result.message,
    })
  }

  return (
    <form className="order-form order-entry" onSubmit={handleSubmit}>
      <label className="field">
        <span>Symbol</span>
        <select
          value={selectedSymbol}
          onChange={(event) => setSelectedSymbol(event.target.value)}
        >
          {quotes.map((quote) => (
            <option key={quote.symbol} value={quote.symbol}>
              {quote.symbol}
            </option>
          ))}
        </select>
      </label>

      <div className="side-toggle">
        <button
          type="button"
          className={side === 'BUY' ? 'active buy' : undefined}
          onClick={() => setSide('BUY')}
        >
          Buy
        </button>
        <button
          type="button"
          className={side === 'SELL' ? 'active sell' : undefined}
          onClick={() => setSide('SELL')}
        >
          Sell
        </button>
      </div>

      <label className="field">
        <span>Order Type</span>
        <select value={type} onChange={(event) => setType(event.target.value as OrderType)}>
          <option value="MARKET">Market</option>
          <option value="LIMIT">Limit</option>
        </select>
      </label>

      <label className="field">
        <span>Quantity</span>
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>

      {type === 'LIMIT' && (
        <label className="field">
          <span>Limit Price</span>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={limitPrice}
            onChange={(event) => setLimitPrice(event.target.value)}
            placeholder={estimatedPrice?.toFixed(2) ?? '0.00'}
            required
          />
        </label>
      )}

      <div className="order-summary">
        <div>
          <span>Est. fill</span>
          <strong>{estimatedPrice ? formatCurrency(estimatedPrice) : '—'}</strong>
        </div>
        <div>
          <span>Est. notional</span>
          <strong>
            {estimatedPrice ? formatCurrency(estimatedPrice * quantity) : '—'}
          </strong>
        </div>
      </div>

      <button type="submit" className={`submit ${side === 'BUY' ? 'buy' : 'sell'}`}>
        Submit {side} Order
      </button>

      {feedback && (
        <p className={`feedback ${feedback.kind}`} role="status">
          {feedback.message}
        </p>
      )}
    </form>
  )
}
