import { forwardRef } from "react"
import React from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'
import { useAppShellStore } from "@packages/app-shell"
import { Burger, Header, MediaQuery } from "@mantine/core"

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    const navbarHidden = useAppShellStore((state) => state.navbarHidden)
    const navbarBreakpoint = useAppShellStore((state) => state.navbarBreakpoint)
    const toggleNavbar = useAppShellStore((state) => state.toggleNavbar)

    return <Header
        withBorder={p.headerWithBorder}
        height={p.headerHeight}
        {...p}
        {...p.customProps}
    >
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan={navbarBreakpoint} styles={{ display: 'none' }}>
                <Burger opened={!navbarHidden} onClick={toggleNavbar} size={p.burgerSize} mr='sm' {...p.customProps?.burger} />
            </MediaQuery>
            {props.children}
        </div>
    </Header>
})
