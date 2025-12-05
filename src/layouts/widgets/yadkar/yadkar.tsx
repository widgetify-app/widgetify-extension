import { useState } from 'react'
import Analytics from '@/analytics'
import { NotesLayout } from '../notes/notes.layout'
import { TodosLayout } from '../todos/todos'

export function YadkarWidget() {
	const [tab, setTab] = useState<'todo' | 'note'>('todo')

	const onChangeTab = (newTab: 'todo' | 'note') => {
		setTab(newTab)
		Analytics.event('yadkar_change_tab')
	}

	if (tab === 'todo') {
		return <TodosLayout onChangeTab={() => onChangeTab('note')} />
	} else return <NotesLayout onChangeTab={() => onChangeTab('todo')} />
}
