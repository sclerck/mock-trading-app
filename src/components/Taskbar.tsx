import { useWorkspace } from '../context/WorkspaceContext'
import { PANELS } from '../types/workspace'
import './Taskbar.css'

export function Taskbar() {
  const { minimizedPanels, openPanel } = useWorkspace()

  return (
    <footer className="taskbar" aria-label="Minimized panels">
      <span className="taskbar-label">Taskbar</span>

      {minimizedPanels.length === 0 ? (
        <span className="taskbar-empty">No minimized panels</span>
      ) : (
        <div className="taskbar-items">
          {minimizedPanels.map((panelId) => {
            const panel = PANELS.find((item) => item.id === panelId)
            if (!panel) {
              return null
            }

            return (
              <button
                key={panel.id}
                type="button"
                className="taskbar-item"
                onClick={() => openPanel(panel.id)}
                title={`Restore ${panel.title}`}
              >
                {panel.title}
              </button>
            )
          })}
        </div>
      )}
    </footer>
  )
}
