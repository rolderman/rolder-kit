import { type PortDef, getPortDef } from '@shared/port-v1.0.0'
import type { Props } from './definition'

export default [
	// Base
	getPortDef({
		name: 'clickedItem',
		displayName: 'Clicked item',
		group: 'Custom',
		customGroup: 'Base',
		type: 'object',
		dependsOn: (p) => p.onRowClick === 'signal',
	}),
	getPortDef({
		name: 'clickedNode',
		displayName: 'Clicked node',
		group: 'Custom',
		customGroup: 'Base',
		type: 'object',
		dependsOn: (p) => p.onRowClick === 'signal' && p.hierarchy,
	}),
	getPortDef({
		name: 'rowClicked',
		displayName: 'Row clicked',
		group: 'Custom',
		customGroup: 'Base',
		type: 'signal',
		dependsOn: (p) => p.onRowClick === 'signal',
	}),
	// Single selection
	getPortDef({
		name: 'selectedItem',
		displayName: 'Selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'selectedNode',
		displayName: 'Selected node',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p) => p.onRowClick === 'singleSelection' && p.hierarchy,
	}),
	getPortDef({
		name: 'selectedItemChanged',
		displayName: 'Selected item changed',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'signal',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	// Multi selection
	getPortDef({
		name: 'selectedItems',
		displayName: 'Selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'array',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'selectedItemsChanged',
		displayName: 'Selected items changed',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'signal',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	// Expansion
	getPortDef({
		name: 'expandedItems',
		displayName: 'Expanded items',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'array',
		dependsOn: (p: Props) => p.expansion,
	}),
	getPortDef({
		name: 'expandedItemsChanged',
		displayName: 'Expanded items changed',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'signal',
		dependsOn: (p: Props) => p.expansion,
	}),
	// Sort
	getPortDef({
		name: 'sortState',
		displayName: 'Sort state',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'object',
		dependsOn: (p: Props) => p.sort,
	}),
	getPortDef({
		name: 'sortStateChanged',
		displayName: 'Sort state changed',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'signal',
		dependsOn: (p: Props) => p.sort,
	}),
] as PortDef[]
