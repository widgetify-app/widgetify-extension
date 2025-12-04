export interface NoteCreateInput {
	title?: string | null
	body?: string | null
	id?: string
	priority?: 'low' | 'medium' | 'high'
}
export interface FetchedNote {
	id: string

	title: string
	body: string
	priority?: 'low' | 'medium' | 'high'
	createdAt: number
	updatedAt: number
}

export interface GetNotesResponse {
	notes: FetchedNote[]
	total: number
	totalPages: number
}
