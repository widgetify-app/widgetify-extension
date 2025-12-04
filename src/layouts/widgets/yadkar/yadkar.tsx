import Analytics from '@/analytics'
import { NotesLayout } from '../notes/notes.layout'
import { TodosLayout } from '../todos/todos'

export function YadkarWidget() {
	const [tab, setTab] = useState<'todo' | 'note'>('todo')

	useEffect(() => {
		Analytics.event('yadkar_change_tab')
	}, [tab])

	if (tab === 'todo') {
		return <TodosLayout onChangeTab={() => setTab('note')} />
	} else return <NotesLayout onChangeTab={() => setTab('todo')} />
}
