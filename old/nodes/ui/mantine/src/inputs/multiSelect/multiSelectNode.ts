import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/multi-select-v1.0.0'

export default reactNode('MultiSelect', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'label',
				'placeholder',
				'disabled',
				'withAsterisk',
				'w',
				'inputError',
				'resetSelected',
				'formField',
				'labelField',
				'radius',
				'inputItems',
				'searchable',
				'clearable',
				'creatable',
				'maxDropdownHeight',
				'dropdownPosition',
				'defaultItems',
			]),
			...inputGroups.Icon,
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['form']),
				default: 'form',
				customs: {
					required: 'connection',
					dependsOn(p) {
						return p.useScope ? true : false
					},
				},
			}),
		],
		outputs: getPorts('output', ['selected', 'newValueSubmited', 'selectedItems', 'newValue', 'reseted', 'closed']),
	},
})
