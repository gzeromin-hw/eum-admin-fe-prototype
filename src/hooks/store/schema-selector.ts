import { create } from 'zustand'
import { graphSchemaClient } from '@/service/api/graph-schema.client'
import { GraphSchemaDto } from '@/service/dtos/graph-schema.dto'

const SCHEMA_STORAGE_KEY = 'eum-schema-selector'

export interface SchemaSelectorOption {
  id: string
  label: string
  statusLabel: string
}

interface SchemaSelectorState {
  selectedId: string
  options: SchemaSelectorOption[]
  isLoading: boolean
  setSelectedId: (id: string) => void
  setOptions: (options: SchemaSelectorOption[]) => void
  loadSchemas: () => Promise<void>
  hydrateFromStorage: () => void
}

interface StorageData {
  selectedId: string
  options: SchemaSelectorOption[]
}

const convertSchemaToOption = (
  schema: GraphSchemaDto,
): SchemaSelectorOption => ({
  id: String(schema.id),
  label: schema.domain,
  statusLabel: schema.is_active ? '운영' : '초안',
})

const useSchemaSelectorStore = create<SchemaSelectorState>(set => {
  return {
    selectedId: '',
    options: [],
    isLoading: false,
    hydrateFromStorage: () => {
      try {
        const stored = localStorage.getItem(SCHEMA_STORAGE_KEY)
        if (stored) {
          const data: StorageData = JSON.parse(stored)
          set({ selectedId: data.selectedId, options: data.options })
        }
      } catch (error) {
        console.error('Failed to load schema from localStorage:', error)
      }
    },
    setSelectedId: id =>
      set(state => {
        const newState = { ...state, selectedId: id }
        saveToStorage(newState)
        return newState
      }),
    setOptions: options =>
      set(state => {
        const hasSelected = options.some(
          option => option.id === state.selectedId,
        )
        const newState = {
          ...state,
          options,
          selectedId: hasSelected ? state.selectedId : (options[0]?.id ?? ''),
        }
        saveToStorage(newState)
        return newState
      }),
    loadSchemas: async () => {
      set({ isLoading: true })
      try {
        const response = await graphSchemaClient.getAllSchemas()
        const options = response.schemas.map(convertSchemaToOption)
        set(state => {
          const hasSelected = options.some(
            option => option.id === state.selectedId,
          )
          const newState = {
            options,
            selectedId: hasSelected ? state.selectedId : (options[0]?.id ?? ''),
            isLoading: false,
          }
          saveToStorage(newState)
          return newState
        })
      } catch (error) {
        console.error('Failed to load schemas:', error)
        set({ isLoading: false })
      }
    },
  }
})

const saveToStorage = (
  state: Pick<SchemaSelectorState, 'selectedId' | 'options'>,
) => {
  if (typeof window === 'undefined') return

  try {
    const data: StorageData = {
      selectedId: state.selectedId,
      options: state.options,
    }
    localStorage.setItem(SCHEMA_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save schema to localStorage:', error)
  }
}

export default useSchemaSelectorStore
