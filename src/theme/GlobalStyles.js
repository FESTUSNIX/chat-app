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
    --bg-dark-lighten7: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 7)};
    --bg-dark-lighten10: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 10)};
    --bg-dark-lighten15: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 15)};
    --bg-dark-lighten20: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 20)};
    --bg-dark-lighten25: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 25)};
    --bg-dark-lighten90: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 90)};
    --bg-dark-lighten120: ${({ theme }) => adjustBrightness(theme.colors.bgDark, 120)};

    --bg-secondary: ${({ theme }) => theme.colors.bgSecondary};
	--bg-secondary-lighten5: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 5)};
	--bg-secondary-lighten10: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 10)};
	--bg-secondary-lighten15: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 15)};
	--bg-secondary-lighten50: ${({ theme }) => adjustBrightness(theme.colors.bgSecondary, 50)};

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
