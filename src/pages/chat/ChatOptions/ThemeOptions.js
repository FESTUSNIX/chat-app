import React, { useState } from 'react'
import { Modal } from '../../../components'
import ThemePicker from './ThemePicker/ThemePicker'
import ThemeCreator from './ThemeCreator/ThemeCreator'
import { useDocument } from '../../../hooks/useDocument'
import { useCollection } from '../../../hooks/useCollection'

export default function ThemeOptions({
	chat,
	showThemePicker,
	showThemeCreator,
	setShowThemeCreator,
	setShowThemePicker
}) {
	const { documents: themes } = useCollection('themes')
	const { document: defaultThemeDoc } = useDocument('themes', 'frosty')

	const [editedTheme, setEditedTheme] = useState(defaultThemeDoc)
	const [confirmCustomTheme, setConfirmCustomTheme] = useState(false)
	const [confirmThemeDelete, setConfirmThemeDelete] = useState(null)

	return (
		themes && (
			<>
				<Modal
					show={showThemePicker}
					setShow={() => setShowThemePicker(false)}
					onClose={() => setConfirmThemeDelete(null)}
					disableOCH={showThemeCreator}>
					<ThemePicker
						themes={themes}
						chat={chat}
						setShowThemeCreator={setShowThemeCreator}
						setEditedTheme={setEditedTheme}
						setConfirmThemeDelete={setConfirmThemeDelete}
						confirmThemeDelete={confirmThemeDelete}
					/>
				</Modal>
				<Modal
					show={showThemeCreator}
					setShow={() => setShowThemeCreator(false)}
					onClose={() => {
						setEditedTheme(null)
						setConfirmCustomTheme(false)
					}}
					disableOCH={confirmCustomTheme}>
					<ThemeCreator
						setShowThemePicker={setShowThemePicker}
						setShowThemeCreator={setShowThemeCreator}
						chat={chat}
						editedTheme={editedTheme}
						setConfirmCustomTheme={setConfirmCustomTheme}
						confirmCustomTheme={confirmCustomTheme}
					/>
				</Modal>
			</>
		)
	)
}
