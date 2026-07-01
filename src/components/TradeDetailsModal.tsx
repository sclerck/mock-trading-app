import { useEffect, type ReactNode } from 'react'
import type { Order, Trade } from '../types'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import './TradeDetailsModal.css'

interface TradeDetailsModalProps {
  trade: Trade
  order: Order | undefined
  onClose: () => void
}

export function TradeDetailsModal({ trade, order, onClose }: TradeDetailsModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const notional = trade.price * trade.quantity

  return (
    <div className="trade-details-overlay" onClick={onClose} role="presentation">
      <div
        className="trade-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="trade-details-header">
          <div>
            <p className="trade-details-eyebrow">Trade Details</p>
            <h3 id="trade-details-title">
              {trade.side} {trade.quantity} {trade.symbol}
            </h3>
          </div>
          <button type="button" className="trade-details-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </header>

        <dl className="trade-details-grid">
          <DetailItem label="Trade ID" value={trade.id} />
          <DetailItem label="Order ID" value={trade.orderId} />
          <DetailItem label="Symbol" value={trade.symbol} />
          <DetailItem
            label="Side"
            value={
              <span className={`side-badge ${trade.side.toLowerCase()}`}>{trade.side}</span>
            }
          />
          <DetailItem label="Quantity" value={trade.quantity.toLocaleString('en-US')} />
          <DetailItem label="Fill Price" value={formatCurrency(trade.price)} />
          <DetailItem label="Notional" value={formatCurrency(notional)} />
          <DetailItem label="Executed At" value={formatDateTime(trade.executedAt)} />
          <DetailItem label="Order Type" value={order?.type ?? '—'} />
          <DetailItem
            label="Limit Price"
            value={order?.limitPrice ? formatCurrency(order.limitPrice) : '—'}
          />
          <DetailItem label="Order Status" value={order?.status ?? '—'} />
          <DetailItem
            label="Submitted At"
            value={order ? formatDateTime(order.submittedAt) : '—'}
          />
        </dl>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="trade-detail-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
