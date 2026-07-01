export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'MARKET' | 'LIMIT'
export type OrderStatus = 'PENDING' | 'FILLED' | 'REJECTED'

export interface Quote {
  symbol: string
  name: string
  bid: number
  ask: number
  last: number
  change: number
  changePercent: number
  volume: number
}

export interface Order {
  id: string
  symbol: string
  side: OrderSide
  type: OrderType
  quantity: number
  limitPrice?: number
  status: OrderStatus
  submittedAt: Date
}

export interface Trade {
  id: string
  orderId: string
  symbol: string
  side: OrderSide
  quantity: number
  price: number
  executedAt: Date
}

export interface OrderFormValues {
  symbol: string
  side: OrderSide
  type: OrderType
  quantity: number
  limitPrice?: number
}
