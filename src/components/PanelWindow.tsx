import type { ReactNode } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import type { PanelId } from '../types/workspace'
import './PanelWindow.css'

interface PanelWindowProps {
  id: PanelId
  title: string
  subtitle?: ReactNode
  headerExtra?: ReactNode
  children: ReactNode
}

export function PanelWindow({ id, title, subtitle, headerExtra, children }: PanelWindowProps) {
  const { panelStates, minimizePanel, maximizePanel, restorePanel } = useWorkspace()
  const viewState = panelStates[id]
  const isMaximized = viewState === 'maximized'

  if (viewState === 'minimized') {
    return null
  }

  function handleToggleSize() {
    if (isMaximized) {
      restorePanel(id)
      return
    }

    maximizePanel(id)
  }

  return (
    <section className={`panel-window panel-window--${viewState}`} data-panel-id={id}>
      <header className="panel-window-header">
        <div className="panel-window-title">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <div className="panel-window-actions">
          {headerExtra}
          <div className="window-controls" aria-label={`${title} window controls`}>
            <button
              type="button"
              className="window-control minimize"
              aria-label={`Minimize ${title}`}
              title="Minimize to taskbar"
              onClick={() => minimizePanel(id)}
            >
              &#8722;
            </button>
            <button
              type="button"
              className="window-control maximize"
              aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
              title={isMaximized ? 'Restore to normal size' : 'Expand to full screen'}
              onClick={handleToggleSize}
            >
              {isMaximized ? '\u29C9' : '\u25A1'}
            </button>
            {isMaximized && (
              <button
                type="button"
                className="window-control restore"
                aria-label={`Restore ${title}`}
                title="Restore to normal size"
                onClick={() => restorePanel(id)}
              >
                &#9634;
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="panel-window-body">{children}</div>
    </section>
  )
}
