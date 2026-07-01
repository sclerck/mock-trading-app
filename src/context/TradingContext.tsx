import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Order, OrderFormValues, Quote, Trade } from '../types'
import { createInitialQuotes, tickQuote } from '../utils/mockMarket'

interface TradingContextValue {
  quotes: Quote[]
  trades: Trade[]
  orders: Order[]
  selectedSymbol: string
  setSelectedSymbol: (symbol: string) => void
  placeOrder: (values: OrderFormValues) => { success: boolean; message: string }
}

const TradingContext = createContext<TradingContextValue | null>(null)

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export function TradingProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>(() => createInitialQuotes())
  const [orders, setOrders] = useState<Order[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuotes((current) => current.map(tickQuote))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const placeOrder = useCallback(
    (values: OrderFormValues): { success: boolean; message: string } => {
      const quote = quotes.find((item) => item.symbol === values.symbol)

      if (!quote) {
        return { success: false, message: 'Unknown symbol.' }
      }

      if (values.quantity <= 0 || !Number.isInteger(values.quantity)) {
        return { success: false, message: 'Quantity must be a positive whole number.' }
      }

      if (values.type === 'LIMIT') {
        if (!values.limitPrice || values.limitPrice <= 0) {
          return { success: false, message: 'Limit price is required for limit orders.' }
        }

        const canFill =
          values.side === 'BUY'
            ? values.limitPrice >= quote.ask
            : values.limitPrice <= quote.bid

        if (!canFill) {
          const order: Order = {
            id: createId('ord'),
            symbol: values.symbol,
            side: values.side,
            type: values.type,
            quantity: values.quantity,
            limitPrice: values.limitPrice,
            status: 'REJECTED',
            submittedAt: new Date(),
          }
          setOrders((current) => [order, ...current])
          return {
            success: false,
            message: `Limit order rejected: ${values.side === 'BUY' ? 'ask' : 'bid'} not reachable at ${values.limitPrice.toFixed(2)}.`,
          }
        }
      }

      const fillPrice = values.side === 'BUY' ? quote.ask : quote.bid
      const orderId = createId('ord')
      const tradeId = createId('trd')
      const executedAt = new Date()

      const order: Order = {
        id: orderId,
        symbol: values.symbol,
        side: values.side,
        type: values.type,
        quantity: values.quantity,
        limitPrice: values.limitPrice,
        status: 'FILLED',
        submittedAt: executedAt,
      }

      const trade: Trade = {
        id: tradeId,
        orderId,
        symbol: values.symbol,
        side: values.side,
        quantity: values.quantity,
        price: fillPrice,
        executedAt,
      }

      setOrders((current) => [order, ...current])
      setTrades((current) => [trade, ...current])

      return {
        success: true,
        message: `${values.side} ${values.quantity} ${values.symbol} @ ${fillPrice.toFixed(2)}`,
      }
    },
    [quotes],
  )

  const value = useMemo(
    () => ({
      quotes,
      trades,
      orders,
      selectedSymbol,
      setSelectedSymbol,
      placeOrder,
    }),
    [quotes, trades, orders, selectedSymbol, placeOrder],
  )

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>
}

export function useTrading(): TradingContextValue {
  const context = useContext(TradingContext)

  if (!context) {
    throw new Error('useTrading must be used within TradingProvider')
  }

  return context
}
