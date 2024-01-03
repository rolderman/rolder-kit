import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_3_0 from './v0.3.0/SegmentedControl'
import v0_3_1 from './v0.3.1/SegmentedControl'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        hashTag: 'deprecated',
        Comp: v0_3_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'labelField', 'disabled', 'radius', 'w', 'inputItems', 'defaultSegmentedControlItem', 'color',
                'fullWidth', 'size', 'segmentedControlOrientation'],
                ['formField']
            )
        ],
        outputs: getPorts('output', ['selected', 'selectedItem'])
    },
    'v0.3.1': {
        Comp: v0_3_1,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'labelField', 'disabled', 'radius', 'w', 'inputItems', 'defaultSegmentedControlItem', 'color',
                'fullWidth', 'size', 'segmentedControlOrientation'],
                ['formField']
            )
        ],
        outputs: getPorts('output', ['selected', 'selectedItem'])
    }
}

//===================================================================

export default getReactNode('SegmentedControl', compVersions)