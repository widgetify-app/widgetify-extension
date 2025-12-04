export interface NoteCreateInput {
	title?: string | null
	body?: string | null
	id?: string
}
export interface FetchedNote {
	id: string

	title: string
	body: string

	createdAt: number
	updatedAt: number
}

export interface GetNotesResponse {
	notes: FetchedNote[]
	total: number
	totalPages: number
}
