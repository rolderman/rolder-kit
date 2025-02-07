import { reactNode } from '@packages/node'

import v100 from '@packages/expansion-row-v1.0.0'
import v110 from '@packages/expansion-row-v1.1.0'

export default reactNode(
	'ExpansionRow',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { static: v100 },
		},
		'v1.1.0': {
			module: { static: v110 },
		},
	},
	{ allowChildren: true }
)
