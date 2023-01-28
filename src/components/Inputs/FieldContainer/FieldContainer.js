// Styles
import './FieldContainer.scss'

const FieldContainer = ({ children, error, title, helpText, optional, containerClass }) => {
	return (
		<div className={`field ${containerClass ? containerClass : ''}`}>
			{title && (
				<p className='field__title'>
					{title}
					{optional && <span className='input-field__optional'> - Optional</span>}
				</p>
			)}

			{children}

			{helpText && !error && <p className='field__help-text'>{helpText}</p>}
			{error && <p className='field__error'>{error}</p>}
		</div>
	)
}

export default FieldContainer
