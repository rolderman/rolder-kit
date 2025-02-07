import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'

export type Props = BaseReactProps & {}

import Comp from '../component/ButtonRightSection'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	afterNode: {
		validate: async (p, model) => {
			const parentNodeName = model.parent?.type.split('.')[2]
			if (parentNodeName === 'Button') return true
			return `Parent of "ButtonRightSection" must be "Button", got "${parentNodeName}".`
		},
	},
} satisfies ReactNodeDef
