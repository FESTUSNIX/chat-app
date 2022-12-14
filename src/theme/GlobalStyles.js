import { createGlobalStyle } from 'styled-components'

const spreadColors = theme => {
	let colors = null
	theme.colors.msgBgOwner.forEach(color => {
		colors === null ? (colors = `${color.value}`) : (colors = `${colors}, ${color.value}`)
	})

	if (theme.colors.msgBgOwner.length === 1) {
		return colors
	} else {
		return `linear-gradient(${colors})`
	}
}

function hexToHSL(H) {
	// Convert hex to RGB first
	let r = 0,
		g = 0,
		b = 0
	if (H.length === 4) {
		r = '0x' + H[1] + H[1]
		g = '0x' + H[2] + H[2]
		b = '0x' + H[3] + H[3]
	} else if (H.length === 7) {
		r = '0x' + H[1] + H[2]
		g = '0x' + H[3] + H[4]
		b = '0x' + H[5] + H[6]
	}
	// Then to HSL
	r /= 255
	g /= 255
	b /= 255
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0

	if (delta === 0) h = 0
	else if (cmax === r) h = ((g - b) / delta) % 6
	else if (cmax === g) h = (b - r) / delta + 2
	else h = (r - g) / delta + 4

	h = Math.round(h * 60)

	if (h < 0) h += 360

	l = (cmax + cmin) / 2
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
	s = +(s * 100).toFixed(1)
	l = +(l * 100).toFixed(1)

	return 'hsl(' + h + ',' + s + '%,' + l + '%)'
}

export const GlobalStyles = createGlobalStyle`
#root {
    --bg-dark: ${({ theme }) => hexToHSL(theme.colors.bgDark)};
    --bg-secondary: ${({ theme }) => hexToHSL(theme.colors.bgSecondary)};
    --input-bg: ${({ theme }) => hexToHSL(theme.colors.inputBg)};
    --input-text: ${({ theme }) => hexToHSL(theme.colors.inputText)};
    --message-color: ${({ theme }) => hexToHSL(theme.colors.messageColor)};
    --message-color-owner: ${({ theme }) => hexToHSL(theme.colors.messageColorOwner)};
    --message-bg: ${({ theme }) => hexToHSL(theme.colors.msgBg)};
    --message-bg-owner: ${({ theme }) => spreadColors(theme)};
    --text-accent: ${({ theme }) => hexToHSL(theme.colors.textAccent)}; 
    --text-heading: ${({ theme }) => hexToHSL(theme.colors.textHeading)}; 
    --text-low-contrast: ${({ theme }) => hexToHSL(theme.colors.textLowContrast)}; 
    --text-mid-contrast: ${({ theme }) => hexToHSL(theme.colors.textMidContrast)}; 
    --border-radius: ${({ theme }) => theme.borderRadius}px;
    --text-primary: #eee;
    --border-color: #252525;
    --link-color: #fff;
    --btn-text: #fff;
}
`
