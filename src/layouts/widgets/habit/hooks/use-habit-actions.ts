import { useState } from 'react'
import Analytics from '@/analytics'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { safeAwait } from '@/services/api'
import { useArchiveHabit } from '@/services/hooks/habit/archive-habit.hook'
import { useGetHabits } from '@/services/hooks/habit/get-habits.hook'
import type { Habit } from '@/services/hooks/habit/habit.interface'

export function useHabitActions() {
	const { isAuthenticated } = useAuth()
	const { data, isLoading, isError, refetch, isRefetching } =
		useGetHabits(isAuthenticated)
	const { mutateAsync: archiveHabit, isPending: isArchiving } = useArchiveHabit()

	const [showForm, setShowForm] = useState(false)
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
	const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
	const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

	const requireAuth = () => {
		if (isAuthenticated) return true
		callEvent('openProfile')
		return false
	}

	const openAddHabit = () => {
		if (!requireAuth()) return
		setEditingHabit(null)
		setShowForm(true)
		Analytics.event('habit_form_opened')
	}

	const openEditHabit = (habit: Habit) => {
		if (!requireAuth()) return
		setEditingHabit(habit)
		setShowForm(true)
		Analytics.event('habit_edit_opened')
	}

	const closeForm = () => {
		setShowForm(false)
		setEditingHabit(null)
	}

	const openHabitDetail = (habitId: string) => {
		setDetailHabitId(habitId)
		Analytics.event('habit_open_detail_model')
	}

	const closeHabitDetail = () => {
		setDetailHabitId(null)
		refetch()
		Analytics.event('habit_close_detail_model')
	}

	const confirmArchive = async () => {
		if (!archiveConfirm || isArchiving) return

		const [error] = await safeAwait(archiveHabit(archiveConfirm))
		if (error) {
			autoFormatErrorToast(error)
			return
		}

		setArchiveConfirm(null)
		setDetailHabitId(null)
		showToast('عادت بایگانی شد.', 'success')
		Analytics.event('habit_archived')
		refetch()
	}

	const onRefresh = () => {
		if (!requireAuth()) return
		refetch()
		Analytics.event('habit_refetch')
	}

	return {
		isAuthenticated,
		habits: data?.items || [],
		icons: data?.icons || [],
		colors: data?.colors || [],
		isLoading,
		isError,
		isRefetching,
		isArchiving,
		refetch,
		showForm,
		editingHabit,
		detailHabitId,
		archiveConfirm,
		setArchiveConfirm,
		openAddHabit,
		openEditHabit,
		closeForm,
		openHabitDetail,
		closeHabitDetail,
		confirmArchive,
		onRefresh,
	}
}
