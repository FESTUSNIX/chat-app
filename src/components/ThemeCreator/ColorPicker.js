const ColorPicker = ({ value, setValue, separator, children }) => {
	return (
		<>
			{separator && (
				<div className='separator'>
					<span>{separator}</span>
				</div>
			)}
			<div className='color-picker'>
				<input
					type='text'
					className='color-picker__value'
					value={value}
					onChange={e => {
						setValue(e)
					}}
				/>
				<input
					type='color'
					value={value}
					onChange={e => {
						setValue(e)
					}}
				/>

				{children}
			</div>
		</>
	)
}

export default ColorPicker
