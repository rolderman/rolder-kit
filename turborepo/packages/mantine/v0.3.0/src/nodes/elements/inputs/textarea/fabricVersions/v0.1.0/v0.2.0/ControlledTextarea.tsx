import { forwardRef, useState } from "react"
import { useDebouncedValue, useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from '@rk/node-fabrik'
import { Textarea } from "@mantine/core"

export default forwardRef(function (props: any) {
    const [value, setValue] = useState<string | number>('')
    const typingDelay = props.debouncedTyping ? props.typingDelay : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)
    useShallowEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

    return (
        <Textarea
            value={value}
            variant={props.textareaVariant}
            error={props.inputError || false}
            onChange={(e) => {
                setValue(e.target.value)
                if (e.target.value?.length === 0) sendSignal(props.noodlNode, 'reseted')
            }}
            {...props}
            {...props.customProps}
        />
    )
})