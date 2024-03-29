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

function adjustBrightness(color, changeAmount) {
	let usePound = false
	if (color) {
		if (color[0] === '#') {
			color = color.slice(1)
			usePound = true
		}

		let R = parseInt(color.substring(0, 2), 16)
		let G = parseInt(color.substring(2, 4), 16)
		let B = parseInt(color.substring(4, 6), 16)

		R = R + changeAmount
		G = G + changeAmount
		B = B + changeAmount

		if (R > 255) R = 255
		else if (R < 0) R = 0

		if (G > 255) G = 255
		else if (G < 0) G = 0

		if (B > 255) B = 255
		else if (B < 0) B = 0

		const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16)
		const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16)
		const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16)

		return (usePound ? '#' : '') + RR + GG + BB
	}
}

export const GlobalStyles = createGlobalStyle`
#root {
    --bg-dark: ${({ theme }) => theme.colors.bgDark};
    --bg-dark-lighten5: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 5)};
    --bg-dark-lighten7: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 7)};
    --bg-dark-lighten10: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 10)};
    --bg-dark-lighten15: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 15)};
    --bg-dark-lighten20: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 20)};
    --bg-dark-lighten25: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 25)};
    --bg-dark-lighten50: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 50)};
    --bg-dark-lighten90: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 90)};
    --bg-dark-lighten120: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 120)};

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

    --text-primary:  ${({ theme }) => theme.colors.textPrimary};
    --text-primary-darken20:  ${({ theme }) => adjustBrightness(theme.colors.textPrimary, -20)};
    --text-primary-darken50:  ${({ theme }) => adjustBrightness(theme.colors.textPrimary, -50)};
    --text-primary-darken100:  ${({ theme }) => adjustBrightness(theme.colors.textPrimary, -100)};

    --text-heading: ${({ theme }) => adjustBrightness(theme.colors.textPrimary, 30)};
    --text-low-contrast: ${({ theme }) => theme.colors.textLowContrast}; 
    --text-mid-contrast: ${({ theme }) => adjustBrightness(theme.colors.textLowContrast, 40)}; 
	
    --btn-text: ${({ theme }) => theme.colors.buttonColor};

}
`
