import { getMainClient } from '../api'

interface Input {
  title?: string | null
  body?: string | null
  offlineId?: string
  onlineId?: string
}
export interface FetchedNote {
  id: string

  title: string
  body: string

  offlineId: string

  createdAt: number
  updatedAt: number
}

export interface GetNotesResponse {
  notes: FetchedNote[]
  total: number
  totalPages: number
}

export async function upsertNote(input: Input) {
  const api = await getMainClient()

  await api.post('/notes', input)
}

export async function getNotes(): Promise<FetchedNote[]> {
  const api = await getMainClient()
  const response = await api.get<GetNotesResponse>('/notes')
  return response.data.notes
}

export async function deleteNote(id: string) {
  const api = await getMainClient()
  await api.delete(`/notes/${id}`)
}
