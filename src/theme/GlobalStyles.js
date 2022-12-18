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

// function hexToHSL(H) {
// 	if (H) {
// 		// Convert hex to RGB first
// 		let r = 0,
// 			g = 0,
// 			b = 0
// 		if (H.length === 4) {
// 			r = '0x' + H[1] + H[1]
// 			g = '0x' + H[2] + H[2]
// 			b = '0x' + H[3] + H[3]
// 		} else if (H.length === 7) {
// 			r = '0x' + H[1] + H[2]
// 			g = '0x' + H[3] + H[4]
// 			b = '0x' + H[5] + H[6]
// 		}
// 		// Then to HSL
// 		r /= 255
// 		g /= 255
// 		b /= 255
// 		let cmin = Math.min(r, g, b),
// 			cmax = Math.max(r, g, b),
// 			delta = cmax - cmin,
// 			h = 0,
// 			s = 0,
// 			l = 0

// 		if (delta === 0) h = 0
// 		else if (cmax === r) h = ((g - b) / delta) % 6
// 		else if (cmax === g) h = (b - r) / delta + 2
// 		else h = (r - g) / delta + 4

// 		h = Math.round(h * 60)

// 		if (h < 0) h += 360

// 		l = (cmax + cmin) / 2
// 		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
// 		s = +(s * 100).toFixed(1)
// 		l = +(l * 100).toFixed(1)

// 		return 'hsl(' + h + ',' + s + '%,' + l + '%)'
// 	}
// }

function adjustBrightness(col, amt) {
	var usePound = false
	if (col) {
		if (col[0] === '#') {
			col = col.slice(1)
			usePound = true
		}

		var R = parseInt(col.substring(0, 2), 16)
		var G = parseInt(col.substring(2, 4), 16)
		var B = parseInt(col.substring(4, 6), 16)

		// to make the colour less bright than the input
		// change the following three "+" symbols to "-"
		R = R + amt
		G = G + amt
		B = B + amt

		if (R > 255) R = 255
		else if (R < 0) R = 0

		if (G > 255) G = 255
		else if (G < 0) G = 0

		if (B > 255) B = 255
		else if (B < 0) B = 0

		var RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16)
		var GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16)
		var BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16)

		return (usePound ? '#' : '') + RR + GG + BB
	}
}

export const GlobalStyles = createGlobalStyle`
#root {
    --bg-dark: ${({ theme }) => theme.colors.bgDark};
    --bg-dark-lighten5: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 5)};
    --bg-dark-lighten10: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 10)};
    --bg-dark-lighten15: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 15)};
    --bg-dark-lighten20: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 20)};
    --bg-dark-lighten90: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 90)};
    --bg-dark-lighten120: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 120)};
    --bg-dark-darken80: #0000ff;

    --bg-secondary: ${({ theme }) => theme.colors.bgSecondary};
	--bg-secondary-lighten5: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 5)};
	--bg-secondary-lighten10: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 10)};
	--bg-secondary-lighten15: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 15)};

    --input-bg: ${({ theme }) => theme.colors.inputBg};
    --input-text: ${({ theme }) => theme.colors.inputText};
	--input-border: ${({ theme }) => theme.colors.inputBorder};

    --message-bg: ${({ theme }) => theme.colors.msgBg};
    --message-color: ${({ theme }) => theme.colors.messageColor};
	--message-border: ${({ theme }) => theme.colors.msgBorder};
	
    --message-bg-owner: ${({ theme }) => spreadColors(theme)};
    --message-color-owner: ${({ theme }) => theme.colors.messageColorOwner};
	--message-border-owner: ${({ theme }) => theme.colors.msgBorderOwner};
	
    --text-accent: ${({ theme }) => theme.colors.textAccent};
    --text-accent-darken25: ${({ theme }) => adjustBrightness(theme.colors.textAccent, -25)};
    --text-accent-darken35: ${({ theme }) => adjustBrightness(theme.colors.textAccent, -55)};

    --border-radius: ${({ theme }) => theme.borderRadius}px;
    --border-color: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 15)};

    --text-primary:  #ff0000;
    --text-primary:  ${({ theme }) => theme.colors.textPrimary};
    --text-heading: ${({ theme }) => adjustBrightness(theme.colors.textPrimary, 30)};
    --text-low-contrast: ${({ theme }) => theme.colors.textLowContrast}; 
    --text-mid-contrast: ${({ theme }) => adjustBrightness(theme.colors.textLowContrast, 40)}; 
	
    --btn-text: ${({ theme }) => theme.colors.buttonColor};

}
`