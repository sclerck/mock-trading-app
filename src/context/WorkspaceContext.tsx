import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_PANEL_STATES,
  PANELS,
  type PanelId,
  type PanelViewState,
} from '../types/workspace'

interface WorkspaceContextValue {
  panelStates: Record<PanelId, PanelViewState>
  activePanelId: PanelId | null
  minimizedPanels: PanelId[]
  maximizedPanelId: PanelId | null
  minimizePanel: (id: PanelId) => void
  maximizePanel: (id: PanelId) => void
  restorePanel: (id: PanelId) => void
  openPanel: (id: PanelId) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [panelStates, setPanelStates] =
    useState<Record<PanelId, PanelViewState>>(DEFAULT_PANEL_STATES)

  const setPanelState = useCallback((id: PanelId, state: PanelViewState) => {
    setPanelStates((current) => ({ ...current, [id]: state }))
  }, [])

  const minimizePanel = useCallback(
    (id: PanelId) => {
      setPanelState(id, 'minimized')
    },
    [setPanelState],
  )

  const maximizePanel = useCallback(
    (id: PanelId) => {
      setPanelStates((current) => {
        const next = { ...current, [id]: 'maximized' as PanelViewState }

        for (const panel of PANELS) {
          if (panel.id !== id && next[panel.id] === 'maximized') {
            next[panel.id] = 'normal'
          }
        }

        return next
      })
    },
    [],
  )

  const restorePanel = useCallback(
    (id: PanelId) => {
      setPanelState(id, 'normal')
    },
    [setPanelState],
  )

  const openPanel = useCallback(
    (id: PanelId) => {
      setPanelStates((current) => {
        const next = { ...current, [id]: 'normal' as PanelViewState }

        for (const panel of PANELS) {
          if (panel.id !== id && next[panel.id] === 'maximized') {
            next[panel.id] = 'normal'
          }
        }

        return next
      })
    },
    [],
  )

  const minimizedPanels = useMemo(
    () => PANELS.filter((panel) => panelStates[panel.id] === 'minimized').map((panel) => panel.id),
    [panelStates],
  )

  const maximizedPanelId = useMemo(
    () => PANELS.find((panel) => panelStates[panel.id] === 'maximized')?.id ?? null,
    [panelStates],
  )

  const activePanelId = useMemo(() => {
    if (maximizedPanelId) {
      return maximizedPanelId
    }

    const visiblePanel = PANELS.find((panel) => panelStates[panel.id] !== 'minimized')
    return visiblePanel?.id ?? null
  }, [maximizedPanelId, panelStates])

  const value = useMemo(
    () => ({
      panelStates,
      activePanelId,
      minimizedPanels,
      maximizedPanelId,
      minimizePanel,
      maximizePanel,
      restorePanel,
      openPanel,
    }),
    [
      panelStates,
      activePanelId,
      minimizedPanels,
      maximizedPanelId,
      minimizePanel,
      maximizePanel,
      restorePanel,
      openPanel,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }

  return context
}
