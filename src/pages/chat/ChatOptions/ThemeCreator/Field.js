const Field = ({ title, setShow, show, children }) => {
	return (
		<div className='field'>
			<p
				onClick={() => {
					setShow()
				}}>
				<i className={`fa-solid fa-angle-right ${show ? 'active' : ''}`}></i>
				<span>{title}</span>
			</p>

			{show && children}
		</div>
	)
}

export default Field
