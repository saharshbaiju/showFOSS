import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppSettings,
  PlaybackDefaults,
  ThemeConfig,
  WidgetConfig,
  WidgetType,
} from '@/types'
import { safeStorage } from '@/lib/storage/safeStorage'
import { defaultSettings } from './defaults'

interface SettingsState extends AppSettings {
  setTheme: (patch: Partial<ThemeConfig>) => void
  setPlayback: (patch: Partial<PlaybackDefaults>) => void
  setWidget: (type: WidgetType, patch: Partial<WidgetConfig>) => void
  toggleWidget: (type: WidgetType) => void
  loadSettings: (settings: AppSettings) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),

      setPlayback: (patch) => set((s) => ({ playback: { ...s.playback, ...patch } })),

      setWidget: (type, patch) =>
        set((s) => ({
          widgets: { ...s.widgets, [type]: { ...s.widgets[type], ...patch } },
        })),

      toggleWidget: (type) =>
        set((s) => ({
          widgets: {
            ...s.widgets,
            [type]: { ...s.widgets[type], enabled: !s.widgets[type].enabled },
          },
        })),

      loadSettings: (settings) =>
        set({
          theme: { ...defaultSettings.theme, ...settings.theme },
          playback: { ...defaultSettings.playback, ...settings.playback },
          widgets: { ...defaultSettings.widgets, ...settings.widgets },
        }),

      reset: () => set({ ...defaultSettings }),
    }),
    {
      name: 'showfoss:settings',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      // Merge persisted state over defaults so new fields get sane values.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppSettings>
        return {
          ...current,
          theme: { ...current.theme, ...p.theme },
          playback: { ...current.playback, ...p.playback },
          widgets: { ...current.widgets, ...p.widgets },
        }
      },
    },
  ),
)

export function selectAppSettings(state: SettingsState): AppSettings {
  return { theme: state.theme, playback: state.playback, widgets: state.widgets }
}
