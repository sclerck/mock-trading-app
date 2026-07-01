import { useTrading } from '../context/TradingContext'
import { formatChange, formatCurrency, formatNumber } from '../utils/formatters'
import './MarketData.css'

export function MarketDataLiveBadge() {
  return <span className="live-badge">LIVE</span>
}

export function MarketData() {
  const { quotes, selectedSymbol, setSelectedSymbol } = useTrading()

  return (
    <div className="market-data">
      <div className="market-table-wrap">
        <table className="market-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last</th>
              <th>Bid</th>
              <th>Ask</th>
              <th>Change</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => {
              const isSelected = quote.symbol === selectedSymbol
              const isUp = quote.change >= 0

              return (
                <tr
                  key={quote.symbol}
                  className={isSelected ? 'selected' : undefined}
                  onClick={() => setSelectedSymbol(quote.symbol)}
                >
                  <td>
                    <div className="symbol-cell">
                      <strong>{quote.symbol}</strong>
                      <span>{quote.name}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(quote.last)}</td>
                  <td className="bid">{formatCurrency(quote.bid)}</td>
                  <td className="ask">{formatCurrency(quote.ask)}</td>
                  <td className={isUp ? 'positive' : 'negative'}>
                    {formatChange(quote.change, quote.changePercent)}
                  </td>
                  <td>{formatNumber(quote.volume)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
