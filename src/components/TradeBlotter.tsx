import { useMemo, useState } from 'react'
import { useTrading } from '../context/TradingContext'
import type { Trade } from '../types'
import { formatCurrency, formatTime } from '../utils/formatters'
import { TradeDetailsModal } from './TradeDetailsModal'
import './TradeBlotter.css'

export function TradeBlotterSubtitle() {
  const { trades } = useTrading()
  return `${trades.length} executed trade${trades.length === 1 ? '' : 's'}`
}

export function TradeBlotter() {
  const { trades, orders } = useTrading()
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedTrade?.orderId),
    [orders, selectedTrade],
  )

  if (trades.length === 0) {
    return (
      <div className="trade-blotter">
        <div className="empty-state">
          <p>No trades yet.</p>
          <span>Submit an order to populate the blotter.</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="trade-blotter">
        <div className="blotter-table-wrap">
          <table className="blotter-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Symbol</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Notional</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="blotter-row"
                  onDoubleClick={() => setSelectedTrade(trade)}
                  title="Double-click to view trade details"
                >
                  <td>{formatTime(trade.executedAt)}</td>
                  <td>{trade.symbol}</td>
                  <td>
                    <span className={`side-badge ${trade.side.toLowerCase()}`}>{trade.side}</span>
                  </td>
                  <td>{trade.quantity}</td>
                  <td>{formatCurrency(trade.price)}</td>
                  <td>{formatCurrency(trade.price * trade.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTrade && (
        <TradeDetailsModal
          trade={selectedTrade}
          order={selectedOrder}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </>
  )
}
