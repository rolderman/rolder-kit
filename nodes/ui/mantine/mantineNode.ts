import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'
import { lazy } from 'react'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const mantineNode = reactNode('Mantine', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/mantine-v1.0.0')),
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/mantine-v1.0.0')),
        },
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    }
}, { allowChildren: true, moduleName: 'mantine' })

//===================================================================
// elements
//// dataDisplay
import imageNode from '@nodes/image'
import badgeNode from '@nodes/badge'
import iconNode from '@nodes/icon'
//// buttons
import actionIconNode from '@nodes/action-icon'
//// inputs
import passwordInputNode from '@nodes/password-input'
import textInputNode from '@nodes/text-input'
import numberInputNode from '@nodes/number-input'
import maskedInputNode from '@nodes/masked-input'
import selectNode from '@nodes/select'
import textareaNode from '@nodes/textarea'
import dateTimePickerNode from '@nodes/date-time-picker'
import segmentedControlNode from '@nodes/segmented-control'
import checkboxGroupNode from '@nodes/checkbox-group'
import checkboxNode from "@nodes/checkbox"
import multiSelectNode from "@nodes/multi-select"
import datePickerInputNode from '@nodes/date-picker-input'
//// typography
import textNode from '@nodes/text'
import titleNode from '@nodes/title'
import highlightNode from '@nodes/highlight'
import listNode from '@nodes/list'
// molecules
import formNode from '@nodes/form'
import groupNode from '@nodes/group'
import stackNode from '@nodes/stack'
// organisms
//// table
import tableNode from '@nodes/table'
import columnCellNode from '@nodes/column-cell'
import expansionRowNode from '@nodes/expansion-row'
import columnFilterNode from '@nodes/column-filter'

Noodl.defineModule({
    reactNodes: [
        mantineNode,
        // elements
        //// dataDisplay
        imageNode, badgeNode, iconNode,
        //// buttons
        actionIconNode,
        //// inputs
        passwordInputNode, textInputNode, numberInputNode, maskedInputNode, selectNode, textareaNode, dateTimePickerNode,
        segmentedControlNode, checkboxGroupNode, checkboxNode, multiSelectNode, datePickerInputNode,
        //// typography
        textNode, titleNode, highlightNode, listNode,
        // molecules
        formNode, groupNode, stackNode,
        // organisms
        //// table
        tableNode, columnCellNode, expansionRowNode, columnFilterNode,
    ]
})