import { reactNode } from '@packages/node'
import { getEnumType, getPort, getPorts, getType } from '@packages/port'
import { lazy } from 'react'

const ganttViewModes = [
	{ value: 'Hour', label: 'Час' },
	{ value: 'QuarterDay', label: 'Четверть дня' },
	{ value: 'HalfDay', label: 'Полдня' },
	{ value: 'Day', label: 'День' },
	{ value: 'Week', label: 'Неделя' },
	{ value: 'Month', label: 'Месяц' },
	{ value: 'QuarterYear', label: 'Квартал' },
	{ value: 'Year', label: 'Год' },
]

const GanttNode = reactNode('Gantt', {
	'v1.0.0': {
		module: { dynamic: lazy(() => import('@packages/gantt-v1.0.0')) },
		inputs: [
			...getPorts('input', ['customProps']),
			getPort({ plug: 'input', name: 'ganttTasks', displayName: 'Tasks', group: 'Data', type: getType('array', 'connection') }),
			getPort({
				plug: 'input',
				name: 'ganttViewMode',
				displayName: 'View mode',
				group: 'Params',
				default: 'Day',
				type: getEnumType(ganttViewModes),
				customs: { required: 'connection' },
			}),
			getPort({
				plug: 'input',
				name: 'showTaskList',
				displayName: 'Show task list',
				group: 'Params',
				type: 'boolean',
				default: false,
			}),
			getPort({
				plug: 'input',
				name: 'ganttHeight',
				displayName: 'Height',
				group: 'Dimensions',
				type: 'boolean',
				default: false,
			}),
		],
		outputs: [
			getPort({ plug: 'output', name: 'ganttChangedTask', displayName: 'Changed task', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'ganttChangedProject', displayName: 'Changed project', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'ganttDeletedTask', displayName: 'Deleted task', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'ganttSelectedTask', displayName: 'Selected task', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'ganttTaskChanged', displayName: 'Task changed', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'ganttExpandChanged', displayName: 'Expand changed', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'ganttTaskDeleted', displayName: 'Task deleted', group: 'Signals', type: 'signal' }),
			getPort({
				plug: 'output',
				name: 'ganttTaskProgressChanged',
				displayName: 'Task progress changed',
				group: 'Signals',
				type: 'signal',
			}),
			...getPorts('input', ['doubleClicked']),
		],
	},
})

//===================================================================

Noodl.defineModule({ reactNodes: [GanttNode] })
