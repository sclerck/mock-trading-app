import { MarketData, MarketDataLiveBadge } from './components/MarketData'
import { OrderEntry } from './components/OrderEntry'
import { PanelWindow } from './components/PanelWindow'
import { Sidebar } from './components/Sidebar'
import { Taskbar } from './components/Taskbar'
import { TradeBlotter, TradeBlotterSubtitle } from './components/TradeBlotter'
import { TradingProvider } from './context/TradingContext'
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext'
import './App.css'

function Workspace() {
  const { panelStates, maximizedPanelId } = useWorkspace()
  const hasVisiblePanels = Object.values(panelStates).some((state) => state !== 'minimized')

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="workspace-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">Single Page Application</p>
            <h1>Mock Trading Desk</h1>
          </div>
          <p className="app-subtitle">
            Use the sidebar and window controls to expand, minimize, or restore each component.
          </p>
        </header>

        <main
          className={`workspace ${maximizedPanelId ? 'workspace--maximized' : 'workspace--normal'}`}
        >
          {!hasVisiblePanels ? (
            <div className="workspace-empty">
              <p>All panels are minimized.</p>
              <span>Restore a panel from the sidebar or taskbar below.</span>
            </div>
          ) : (
            <>
              <PanelWindow
                id="market-data"
                title="Live Market Data"
                subtitle="Simulated quotes refresh every second"
                headerExtra={<MarketDataLiveBadge />}
              >
                <MarketData />
              </PanelWindow>

              <PanelWindow
                id="order-entry"
                title="Order Entry"
                subtitle="Place mock market or limit orders"
              >
                <OrderEntry />
              </PanelWindow>

              <PanelWindow
                id="trade-blotter"
                title="Trade Blotter"
                subtitle={<TradeBlotterSubtitle />}
              >
                <TradeBlotter />
              </PanelWindow>
            </>
          )}
        </main>

        <Taskbar />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <TradingProvider>
      <WorkspaceProvider>
        <Workspace />
      </WorkspaceProvider>
    </TradingProvider>
  )
}
