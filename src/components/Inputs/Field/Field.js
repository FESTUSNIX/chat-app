import { useState } from 'react'

// Styles
import './Field.scss'
import '../InputStyles.scss'

// Components
import FieldContainer from '../FieldContainer/FieldContainer'

const TextField = ({
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
}) => {
	const [showPassword, setShowPassword] = useState(false)

	if ((value, setValue)) {
		return (
			<FieldContainer error={error} title={title} helpText={helpText} optional={optional}>
				<div className={`input-field ${error ? 'field-error' : ''}`}>
					{label && (
						<label className={`${value.trim().length > 0 ? 'active' : ''}`}>
							{label}
							{optional && <span className='input-field__optional'> - Optional</span>}
						</label>
					)}

					<input
						type={showPassword ? 'text' : type}
						value={value}
						onChange={e => setValue(e.target.value)}
						placeholder={placeholder && !label ? placeholder : ''}
						onBlur={() => {
							resetError()
							onLostFocus()
						}}
					/>

					{error && type !== 'password' && <i className='fa-solid fa-circle-exclamation input-field__icon'></i>}

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

export default TextField
