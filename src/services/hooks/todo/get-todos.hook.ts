import { useInfiniteQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedTodo } from './todo.interface'

interface GetTodosParams {
	page?: number
	limit?: number
	isCompleted?: boolean
	dateFilter?: 'all' | 'today' | 'this_month'
	category?: string
}

interface GetTodosResponse {
	todos: FetchedTodo[]
	totalPages: number
	totals: number
}

export const useGetTodos = (enabled: boolean, params?: Omit<GetTodosParams, 'page'>) => {
	return useInfiniteQuery<GetTodosResponse>({
		queryKey: ['getTodos', params],
		queryFn: async ({ pageParam = 1 }) =>
			getTodos({ ...params, page: pageParam as number }),
		retry: 0,
		enabled,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			return currentPage < lastPage.totalPages ? currentPage + 1 : undefined
		},
	})
}

export async function getTodos(params?: GetTodosParams): Promise<GetTodosResponse> {
	const client = getMainClient()
	const queryParams = new URLSearchParams()

	if (params?.page) queryParams.append('page', params.page.toString())
	if (params?.limit) queryParams.append('limit', params.limit.toString())
	if (params?.isCompleted !== undefined)
		queryParams.append('isCompleted', params.isCompleted.toString())
	if (params?.dateFilter && params.dateFilter !== 'all')
		queryParams.append('dateFilter', params.dateFilter)
	if (params?.category && params.category !== '-all-')
		queryParams.append('category', params.category)

	const { data } = await client.get<GetTodosResponse>(`/todos/v2/@me`, {
		params,
	})
	return data
}
