import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_3_0 from './v0.3.0/Icon'
import v0_4_0 from './v0.4.0/Icon'
import v0_5_0 from './v0.5.0/IconLazy'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [...getGroupedPorts('input', ['Icon']), ...getPorts('input', ['color'])]
    },
    'v0.4.0': {
        Comp: v0_4_0,
        inputs: [...getGroupedPorts('input', ['Icon']), ...getPorts('input', ['iconColor', 'useScope', 'scope'])]
    },
    'v0.5.0': {
        Comp: v0_5_0,
        inputs: getPorts('input', [
            'useScope', 'scope', 'iconType', 'iconName', 'iconSize', 'stroke', 'iconColor', 'themeIconVariant', 'themeIconSize',
            'themeIconRadius', 'themeIconColor', 'themeIconGradient',
        ])
    }
}

//===================================================================

export default getReactNode('Icon', compVersions)