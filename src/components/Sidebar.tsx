import { useWorkspace } from '../context/WorkspaceContext'
import { PANELS } from '../types/workspace'
import './Sidebar.css'

export function Sidebar() {
  const { panelStates, activePanelId, openPanel } = useWorkspace()

  return (
    <nav className="sidebar" aria-label="Component menu">
      <div className="sidebar-brand">
        <p className="sidebar-eyebrow">Components</p>
        <h2>Trading Desk</h2>
      </div>

      <ul className="sidebar-menu">
        {PANELS.map((panel) => {
          const state = panelStates[panel.id]
          const isActive = activePanelId === panel.id

          return (
            <li key={panel.id}>
              <button
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => openPanel(panel.id)}
              >
                <span className="sidebar-item-title">{panel.title}</span>
                <span className="sidebar-item-meta">{panel.description}</span>
                <span className={`sidebar-item-state state-${state}`}>{formatStateLabel(state)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function formatStateLabel(state: string): string {
  switch (state) {
    case 'maximized':
      return 'Expanded'
    case 'minimized':
      return 'Minimized'
    default:
      return 'Normal'
  }
}
