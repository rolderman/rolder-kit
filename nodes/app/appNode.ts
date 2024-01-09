import { getCustomEnumType, getPort } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

import app140 from '@rk/app-v1.4.0'

const compVersions: CompVersions = {
    'v1.4.0': {
        module: app140,
        inputs: [
            getPort({
                plug: 'input', name: 'colorScheme', displayName: 'Color scheme', group: 'Style',
                type: getCustomEnumType(['light', 'dark', 'auto']), default: 'light', customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'appLoader', displayName: 'App loader', group: 'Loader', type: 'boolean', default: true }),
            getPort({
                plug: 'input', name: 'appLoaderColor', displayName: 'Color', group: 'Loader', type: 'color', default: '#073BF5',
                customs: {
                    required: 'both',
                    dependsOn(props) { return props.appLoader ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'setColorScheme', displayName: 'Set color scheme', group: 'Signals', type: 'signal',
                customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
            }),
            getPort({
                plug: 'input', name: 'toggleColorScheme', displayName: 'Toggle color scheme', group: 'Signals', type: 'signal',
                customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
            }),
        ],
        outputs: [
            getPort({
                plug: 'output', name: 'colorScheme', displayName: 'Color scheme', group: 'Style', type: 'string',
                customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
            }),
            getPort({
                plug: 'output', name: 'colorSchemeChanged', displayName: 'Color scheme changed', group: 'Signals', type: 'signal',
                customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
            }),
        ]
    },
}

//===================================================================
window.Noodl.defineModule({
    reactNodes: [reactNode('App', compVersions, { allowChildren: true })],
    settings: [
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Rolder', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Rolder' },
        { name: 'projectDefaults', type: 'array', displayName: 'Project defaults', group: 'Rolder' },
        { name: 'mantineTheme', type: 'array', displayName: 'Mantine theme', group: 'Rolder' }
    ]
})