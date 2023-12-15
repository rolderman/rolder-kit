import { forwardRef, useImperativeHandle } from "react"
import { sendOutput } from "../../../../../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any, ref) {
    useImperativeHandle(ref, () => ({
        table2SetFilterValue() { if (props.table2FilterValue) sendOutput(props.noodlNode, 'table2FilterValue', props.table2FilterValue) },
        table2Filter() {
            sendOutput(props.noodlNode, 'table2FilterValue', props.table2FilterValue)
            props.Filter(props.table2ColumnIndex, props.table2FilterValue)
        },
        close() { props.close() },
        reset() {
            sendOutput(props.noodlNode, 'table2FilterValue', null)
            props.Filter(props.table2ColumnIndex)
        },
    }), [props])

    return props.children
})