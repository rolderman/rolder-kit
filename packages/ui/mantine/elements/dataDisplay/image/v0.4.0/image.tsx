import { Image } from "@mantine/core"
import { forwardRef } from "react"
import { CompProps } from "./types"
import { getCompProps } from '@rk/port'
import icons from '@rk/icons'
import { useScope } from "@rk/scope"

export default forwardRef(function (props: CompProps, ref) {

    const scope = useScope(props.scope, 'v0.1.0')
    const item = props.useScope && scope && scope.item.get()

    const p = { ...getCompProps(props, item) } as CompProps

    const imageProps = { ...p }
    delete imageProps.placeholderIconSize
    return <Image
        placeholder={<icons.IconPhoto size={p.placeholderIconSize} />}
        {...imageProps}
        {...imageProps.customProps}
    />
})