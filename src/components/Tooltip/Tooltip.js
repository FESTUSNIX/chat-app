// Styles
import './Tooltip.scss'

const Tooltip = ({ children, pos, align, className }) => {
	return (
		<div className={`tooltip ${pos ? pos : ''} ${align ? align : ''} ${className ? className : ''}`}>
			<div className='tooltip__content'>{children ? children : 'tooltip'}</div>
		</div>
	)
}

export default Tooltip
