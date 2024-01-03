import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/MultiSelect'
import v0_3_0 from './v0.3.0/MultiSelect'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputItems',
                'searchable', 'clearable', 'creatable', 'defaultItems', 'maxDropdownHeight', 'dropdownPosition'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItems', 'createValue']),
        signals: getPorts('input', ['resetSelected'])
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputItems',
                'searchable', 'clearable', 'creatable', 'defaultItems', 'maxDropdownHeight', 'dropdownPosition', 'inputError',
                'backgroundColor'
            ],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItems', 'createValue', 'reseted', 'closed']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('MultiSelect', compVersions)