import { ThemeIcon, getThemeColor, useMantineTheme } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const Icon = p.name && R.libs.icons[p.name]
	const iconSize = p.type === 'icon' ? p.iconSize : p.iconThemeSize
	const theme = useMantineTheme()
	const iconColor = p.type === 'icon' && !p.disabled && p.iconColor ? getThemeColor(p.iconColor || 'black', theme) : undefined
	const themeColor = p.type === 'themeIcon' && !p.disabled ? p.themeColor : 'gray'

	if (!Icon) return null
	if (p.type === 'icon') return <Icon size={iconSize} color={iconColor} stroke={p.stroke} />
	return (
		<ThemeIcon color={themeColor} {...p}>
			<Icon size={iconSize} color={iconColor} stroke={p.stroke} />
		</ThemeIcon>
	)
})
