import { useState } from 'react'

// Styles
import '../InputStyles.scss'

// Components
import FieldContainer from '../FieldContainer/FieldContainer'

const Field = ({
	value,
	setValue,
	label,
	placeholder,
	title,
	helpText,
	error,
	resetError,
	onLostFocus,
	type,
	optional,
	onClick,
	containerClass,
	inputClass,
	after,
}) => {
	const [showPassword, setShowPassword] = useState(false)

	if ((value, setValue)) {
		return (
			<FieldContainer
				error={error}
				title={title}
				helpText={helpText}
				optional={optional}
				containerClass={containerClass}>
				<div
					className={`input-field ${error ? 'field-error' : ''}`}
					onClick={() => {
						if (onClick) onClick()
					}}>
					{label && (
						<div className={`input-field__label ${value.trim().length > 0 ? 'active' : ''}`}>
							{label}
							{optional && <span className='input-field__optional'> - Optional</span>}
						</div>
					)}

					<input
						type={showPassword ? 'text' : type}
						className={inputClass ? inputClass : ''}
						value={value}
						onChange={e => setValue(e.target.value)}
						placeholder={placeholder && !label ? placeholder : ''}
						onBlur={() => {
							if (resetError) resetError()
							if (onLostFocus) onLostFocus()
						}}
					/>

					{!error && after && <div className='input-field__icon input-field__icon--after'>{after}</div>}

					{error && type !== 'password' && (
						<i className='fa-solid fa-circle-exclamation  input-field__icon input-field__icon--error'></i>
					)}

					{type === 'password' && (
						<>
							{showPassword && (
								<i
									className='fa-regular fa-eye input-field__icon input-field__icon--password'
									onClick={() => {
										setShowPassword(false)
									}}></i>
							)}
							{!showPassword && (
								<i
									className='fa-regular fa-eye-slash input-field__icon input-field__icon--password'
									onClick={() => {
										setShowPassword(true)
									}}></i>
							)}
						</>
					)}
				</div>
			</FieldContainer>
		)
	}
}

export default Field
