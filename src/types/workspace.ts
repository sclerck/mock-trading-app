export type PanelId = 'market-data' | 'order-entry' | 'trade-blotter'

export type PanelViewState = 'normal' | 'maximized' | 'minimized'

export interface PanelDefinition {
  id: PanelId
  title: string
  description: string
}

export const PANELS: PanelDefinition[] = [
  {
    id: 'market-data',
    title: 'Live Market Data',
    description: 'Simulated quotes refresh every second',
  },
  {
    id: 'order-entry',
    title: 'Order Entry',
    description: 'Place mock market or limit orders',
  },
  {
    id: 'trade-blotter',
    title: 'Trade Blotter',
    description: 'Executed trades and fill history',
  },
]

export const DEFAULT_PANEL_STATES: Record<PanelId, PanelViewState> = {
  'market-data': 'normal',
  'order-entry': 'normal',
  'trade-blotter': 'normal',
}
