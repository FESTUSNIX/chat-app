import { useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEscapeKey } from '../hooks/useEscapeKey'

// Styles
import './Modal.scss'

export default function Modal({ children, show, setShow, onClose }) {
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
					}}>
					<div className='modal__content'>
						{children}
						<i className='fa-solid fa-xmark close-btn' onClick={() => setShow()}></i>
					</div>
				</OutsideClickHandler>
			</div>
		)
	)
}
