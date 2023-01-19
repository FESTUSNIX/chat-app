import { useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEscapeKey } from '../../hooks/useEscapeKey'

// Styles
import './Modal.scss'

export default function Modal({ children, show, setShow, onClose, disableOCH, button1, button2 }) {
	useEffect(() => {
		if (show === false && onClose) {
			onClose()
		}
	}, [show])

	const hideModal = () => {
		setShow()
	}

	useEscapeKey(hideModal)

	return (
		show && (
			<div className='modal'>
				<OutsideClickHandler
					onOutsideClick={() => {
						setShow()
					}}
					disabled={disableOCH}>
					<div className='modal__content'>
						{children}
						<i className='fa-solid fa-xmark close-btn' onClick={() => setShow()}></i>
					</div>
				</OutsideClickHandler>
			</div>
		)
	)
}
